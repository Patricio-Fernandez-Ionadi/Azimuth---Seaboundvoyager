/**
 * DialogManager
 * ----------------------------------------------------------------------
 * Controla la presentación y avance de un diálogo con un NPC.
 *
 * Formato de nodo de diálogo (extendido, retrocompatible):
 *   - string                                  -> mensaje lineal.
 *   - { message, options }                    -> nodo con opciones.
 *   - { message, options, next }              -> tras las opciones, salta.
 *   - { id, message, options }                -> id para usar en `next`.
 *   - opción: { text|label, callback, requires, skillCheck,
 *               effects, onSuccess, onFail, next, unlocks }
 *
 *   `requires`  : { skill:{perspicacia:30}, affinity:{asombro:3}, ... }
 *   `skillCheck`: { skill:'perspicacia', dc:40, mod:0, modAffinity:'asombro' }
 *   `effects`   : [ { type:'affinity'|'skillXP'|'item'|'gold'|'startQuest'|'progressQuest'|'flag', ... } ]
 *   `next`      : índice numérico (jump) o 'end' (cerrar diálogo).
 *
 * La presentación gráfica (caja de texto + opciones) la hace este manager
 * con un único método `render()`: la altura se calcula dinámicamente para
 * que el texto wrappee, las opciones quepan, y la caja nunca salga del
 * viewport. La aplicación de efectos se delega a QuestManager.applyEffect
 * cuando es posible, pero el manager también los aplica directamente para
 * opciones que no son parte de una quest.
 *
 * Modo "despedida": cuando un NPC con oneShot ya consumió su diálogo
 * principal, al volverse a interactuar se muestran sus `farewellDialogs`
 * como una secuencia de strings lineales (sin opciones, sin effects).
 * Tras mostrarla, el NPC queda en estado 'done' y no hablará más.
 */

import { fontStyles } from '../fonts.js'
import { Panel } from '../../components/Panel.js'
import { THEME } from '../../components/theme.js'
import { roundRect } from '../../components/internal/canvas.js'

export class DialogManager {
	constructor(game) {
		this.game = game
		this.eventSystem = this.game.eventSystem
		this.currentNPC = null
		this.currentMessageIndex = 0
		this.selectedOptionIndex = 0
		this.currentMessage = null
		this.currentOptions = null
		// true cuando el diálogo llegó a su fin natural (jump a 'end' o
		// índice pasado el último nodo). Distingue "terminé" de "salí
		// caminando / presioné escape".
		this.dialogReachedEnd = false
		// Modo despedida: true mientras se está mostrando la despedida
		// one-shot del NPC.
		this.isFarewell = false
	}

	/* ============================================================
	 * Ciclo de diálogo
	 * ============================================================ */

	startDialogue(npc) {
		this.currentNPC = npc
		this.currentMessageIndex = 0
		this.selectedOptionIndex = 0
		this.dialogReachedEnd = false

		const dialogCap = npc.capabilities?.dialog
		// Si el NPC ya consumió su diálogo principal y tiene despedida
		// pendiente, entramos en modo despedida.
		if (dialogCap?.hasPendingFarewell()) {
			this.isFarewell = true
		} else {
			this.isFarewell = false
		}
		this.#showNode()
	}

	/**
	 * Avanza el diálogo desde el estado actual.
	 * Llamado cuando el jugador presiona E con un NPC en interacción.
	 * - Si estamos en despedida, avanza por las líneas o cierra al final.
	 * - Si el nodo actual tiene `next` (no opciones), salta al target.
	 * - Si el nodo actual es de opciones, no hace nada (debe elegir).
	 * - En otro caso, incrementa el índice y muestra el siguiente.
	 */
	advanceDialogue() {
		if (!this.currentNPC) return

		// Modo despedida: avance lineal de strings sin opciones.
		if (this.isFarewell) {
			const queue = this.currentNPC.capabilities?.dialog?.farewellDialogs ?? []
			this.currentMessageIndex += 1
			if (this.currentMessageIndex >= queue.length) {
				this.dialogReachedEnd = true
				this.endDialogue()
			} else {
				this.#showNode()
			}
			return
		}

		const node = this.currentNPC.dialogs[this.currentMessageIndex]
		if (!node) {
			this.dialogReachedEnd = true
			this.endDialogue()
			return
		}

		// Nodo de opciones: E no avanza, hay que elegir con W/S + Q.
		if (typeof node === 'object' && node.options) return

		// Nodo con `next`: saltar al target (mostrándolo).
		if (typeof node === 'object' && node.next !== undefined) {
			this.#jumpTo(node.next)
			return
		}

		// Nodo plano: avanzar al siguiente índice y mostrarlo.
		this.currentMessageIndex += 1
		this.#showNode()
	}

	/** Muestra el nodo actual sin avanzar. */
	#showNode() {
		if (!this.currentNPC) return

		// Modo despedida: usar el array farewellDialogs.
		if (this.isFarewell) {
			const queue = this.currentNPC.capabilities?.dialog?.farewellDialogs ?? []
			const line = queue[this.currentMessageIndex]
			if (line == null) {
				this.dialogReachedEnd = true
				this.endDialogue()
				return
			}
			this.currentMessage = line
			this.currentOptions = null
			return
		}

		const node = this.currentNPC.dialogs[this.currentMessageIndex]
		if (!node) {
			this.dialogReachedEnd = true
			this.endDialogue()
			return
		}

		if (typeof node === 'object' && node.options) {
			this.currentMessage = node.message ?? ''
			this.currentOptions = this.#filterOptions(node.options)
			this.selectedOptionIndex = 0
		} else {
			this.currentMessage = typeof node === 'object' ? (node.message ?? '') : node
			this.currentOptions = null
		}
	}

	/** Cierra el diálogo y notifica al NPC. */
	endDialogue() {
		if (this.currentNPC) {
			const npc = this.currentNPC
			const dialogCap = npc.capabilities?.dialog

			// Transiciones de estado del one-shot:
			// - Si la despedida terminó, marcarla como hecha.
			// - Si el diálogo principal terminó y el NPC es one-shot,
			//   marcar consumido (pasa a 'consumed' o 'done' según
			//   tenga despedida).
			if (dialogCap?.oneShot) {
				if (this.isFarewell && this.dialogReachedEnd) {
					dialogCap.markFarewellDone()
				} else if (!this.isFarewell && this.dialogReachedEnd) {
					dialogCap.markConsumed()
				}
			}

			npc.endInteraction()
			this.currentNPC = null
			this.currentMessageIndex = 0
			this.selectedOptionIndex = 0
			this.currentMessage = null
			this.currentOptions = null
			this.dialogReachedEnd = false
			this.isFarewell = false
		}
	}

	/**
	 * Maneja la selección de una opción por parte del jugador.
	 * Ejecuta: requires -> skillCheck -> callback/effects -> next.
	 */
	selectOption(index) {
		if (!this.currentNPC || !this.currentOptions) return

		const selected = this.currentOptions[index]
		if (!selected) return

		// Callback legado (compatibilidad hacia atrás con NPCs actuales).
		if (typeof selected.callback === 'function') {
			selected.callback()
		}

		// Caso especial legado: Comerciar -> abrir ventana de comercio.
		if (selected.text === 'Comerciar') {
			this.eventSystem.emit('playerTradeWindowOpen', {
				player: this.game.player,
				npc: this.currentNPC,
			})
			return
		}

		// Si requiere skillCheck, ejecutarlo.
		const check = selected.skillCheck
		if (check) {
			const aff = this.game.affinityManager
			const mod = (check.mod ?? 0) +
				(check.modAffinity ? aff.getValue(check.modAffinity) : 0)
			const result = this.game.skillManager.useSkill(
				check.skill,
				check.dc,
				mod
			)
			if (result.success) {
				this.#runEffects(selected.onSuccess?.effects ?? selected.effects ?? [])
				this.#runUnlock(selected.onSuccess?.unlocks ?? selected.unlocks ?? [])
				this.#jumpTo(selected.onSuccess?.next ?? selected.next)
			} else {
				this.#runEffects(selected.onFail?.effects ?? [])
				this.#jumpTo(selected.onFail?.next ?? null)
			}
			return
		}

		// Sin skillCheck: emitir choiceMade ANTES de jumpTo (si next === 'end',
		// endDialogue pone currentNPC a null y el emit tiraría).
		this.eventSystem.emit('choiceMade', {
			npcId: this.currentNPC?.id,
			optionId: selected.id ?? selected.text,
		})

		// Aplicar effects directos y saltar.
		this.#runEffects(selected.effects ?? [])
		this.#runUnlock(selected.unlocks ?? [])
		this.#jumpTo(selected.next)
	}

	/* ============================================================
	 * Helpers internos
	 * ============================================================ */

	/** Filtra opciones que NO cumplen `requires`. */
	#filterOptions(options) {
		return options.filter((opt) => this.#meetsRequires(opt.requires))
	}

	/** ¿El jugador cumple las condiciones de requires? */
	#meetsRequires(requires) {
		if (!requires) return true
		const sm = this.game.skillManager
		const am = this.game.affinityManager
		const qm = this.game.questManager

		if (requires.skill) {
			for (const [skill, level] of Object.entries(requires.skill)) {
				if (!sm.meets(skill, level)) return false
			}
		}
		if (requires.affinity) {
			for (const [branch, level] of Object.entries(requires.affinity)) {
				if (!am.meets(branch, level)) return false
			}
		}
		if (requires.quests) {
			for (const qId of requires.quests) {
				if (!qm.completedQuests.has(qId)) return false
			}
		}
		if (requires.items) {
			for (const it of requires.items) {
				if (!qm.playerHasItem(it.id, it.quantity ?? 1)) return false
			}
		}
		return true
	}

	/** Aplica una lista de effects reutilizando QuestManager.applyEffect. */
	#runEffects(effects) {
		if (!effects?.length) return
		for (const e of effects) {
			this.game.questManager.applyEffect(e)
		}
	}

	/** Desbloquea quests (startQuest) si el NPC las ofrece. */
	#runUnlock(unlocks) {
		if (!unlocks?.length) return
		for (const u of unlocks) {
			if (typeof u === 'string') {
				this.game.questManager.startQuest(u)
			} else if (u?.questId) {
				this.game.questManager.startQuest(u.questId)
			}
		}
	}

	/**
	 * Salta el diálogo según `next`:
	 *   - undefined / null   -> avanzar un nodo (comportamiento por defecto).
	 *   - número N           -> saltar al índice N.
	 *   - 'end'              -> cerrar el diálogo.
	 *   - string (id de nodo)-> buscar el nodo con ese id y saltar allí.
	 */
	#jumpTo(next) {
		if (next === undefined || next === null) {
			this.currentMessageIndex += 1
			this.#showNode()
			return
		}
		if (next === 'end') {
			this.dialogReachedEnd = true
			this.endDialogue()
			return
		}
		if (typeof next === 'number') {
			this.currentMessageIndex = next
			this.#showNode()
			return
		}
		if (typeof next === 'string') {
			// Buscar por `id` en los nodos.
			const dialogs = this.currentNPC.dialogs ?? []
			const idx = dialogs.findIndex((n) => n?.id === next)
			if (idx >= 0) {
				this.currentMessageIndex = idx
				this.#showNode()
				return
			}
		}
		// Si no se entiende el next, cerrar el diálogo.
		this.endDialogue()
	}

	/* ============================================================
	 * Update (input handling que no sea handled por CityScene)
	 * ============================================================ */

	update() {
		if (!this.currentNPC) return
		// Escape cierra el diálogo activo (antes vivía en renderOptionsBox,
		// pero mezclar input y render es una trampa).
		if (this.game.keyboard.onPress.escape) {
			this.endDialogue()
		}
	}

	/* ============================================================
	 * Render: caja unificada con word-wrap, opciones y nombre del NPC
	 * ============================================================ */

	render() {
		if (!this.currentMessage && !this.currentOptions) return
		const { ctx } = this.game

		/* --- Tipografía y métricas --- */
		const BODY_SIZE = 18
		const OPTION_SIZE = 18
		const HINT_SIZE = 11

		const BODY_FONT = `${BODY_SIZE}px ${fontStyles.body.name}, Arial, sans-serif`
		const OPTION_FONT = `${OPTION_SIZE}px ${fontStyles.body.name}, Arial, sans-serif`
		const HINT_FONT = `${HINT_SIZE}px Arial, sans-serif`

		const LINE_H = BODY_SIZE + 6
		const OPTION_H = OPTION_SIZE + 10
		const FOOTER_H = 16
		const MSG_GAP = 12
		const OPTION_GAP = 10
		const FOOTER_GAP = 12
		const INNER_PADDING = 18

		/* --- Ancho de la caja (entre 320 y 640, pero siempre deja margen) --- */
		const minWidth = 320
		const maxWidth = 640
		const boxWidth = Math.max(
			minWidth,
			Math.min(maxWidth, this.game.width - 40),
		)
		const textMaxWidth = boxWidth - INNER_PADDING * 2

		/* --- Word-wrap del mensaje --- */
		ctx.font = BODY_FONT
		const messageLines = this.#wrapText(
			ctx,
			this.currentMessage ?? '',
			textMaxWidth,
		)

		/* --- Cálculo de altura --- */
		const npcName = this.#getNPCName()
		// El título y el padding superior ya los gestiona Panel,
		// así que acá solo calculamos el alto del contenido interior.
		let contentH = 0
		contentH += messageLines.length * LINE_H
		if (this.currentOptions) {
			contentH += MSG_GAP + 1 + OPTION_GAP
			contentH += this.currentOptions.length * OPTION_H
		}
		contentH += FOOTER_GAP + FOOTER_H
		const boxHeight = contentH + INNER_PADDING * 2 + (npcName ? 38 : 0)

		/* --- Posición: centrada horizontal, pegada al fondo --- */
		const x = Math.round((this.game.width - boxWidth) / 2)
		let y = this.game.height - boxHeight - 20
		if (y < 20) y = 20

		/* --- Dibujar el panel temático con su pildora de título --- */
		const panel = new Panel({
			x,
			y,
			width: boxWidth,
			height: boxHeight,
			title: npcName,
			padding: INNER_PADDING,
		})
		const inner = panel.draw(ctx)

		/* Cursor vertical de dibujo: arranca al tope de `inner` */
		let curY = inner.y

		/* --- Mensaje (con word-wrap y sombra) --- */
		ctx.font = BODY_FONT
		ctx.textAlign = 'left'
		for (let i = 0; i < messageLines.length; i++) {
			const baselineY = curY + BODY_SIZE + 2
			ctx.fillStyle = THEME.textShadow
			ctx.fillText(messageLines[i], inner.x + 1, baselineY + 1)
			ctx.fillStyle = THEME.text
			ctx.fillText(messageLines[i], inner.x, baselineY)
			curY += LINE_H
		}

		/* --- Opciones (separador + filas) --- */
		if (this.currentOptions) {
			curY += MSG_GAP
			ctx.strokeStyle = THEME.divider
			ctx.lineWidth = 1
			ctx.beginPath()
			ctx.moveTo(inner.x, curY + 0.5)
			ctx.lineTo(inner.x + inner.width, curY + 0.5)
			ctx.stroke()
			curY += 1 + OPTION_GAP

			for (let i = 0; i < this.currentOptions.length; i++) {
				const opt = this.currentOptions[i]
				const text = opt.text ?? opt.label ?? '(sin texto)'
				const isSelected = i === this.selectedOptionIndex
				const rowY = curY

				// Highlight de fila seleccionada
				if (isSelected) {
					ctx.fillStyle = THEME.selectedBg
					this.#roundRect(
						ctx,
						inner.x - 4,
						rowY + 1,
						inner.width + 8,
						OPTION_H - 4,
						4,
					)
					ctx.fill()
				}

				ctx.font = OPTION_FONT

				// Cursor ▶ para la fila activa
				const cursor = isSelected ? '▶' : ' '
				ctx.fillStyle = isSelected
					? THEME.selected
					: 'rgba(201, 184, 150, 0.25)'
				ctx.textBaseline = 'alphabetic'
				ctx.fillText(cursor, inner.x, rowY + OPTION_SIZE + 1)

				// Texto de la opción (con sombra si está seleccionada)
				const textX = inner.x + 22
				const textY = rowY + OPTION_SIZE + 1
				if (isSelected) {
					ctx.fillStyle = THEME.textShadow
					ctx.fillText(text, textX + 1, textY + 1)
					ctx.fillStyle = THEME.selected
				} else {
					ctx.fillStyle = THEME.textDim
				}
				ctx.fillText(text, textX, textY)

				curY += OPTION_H
			}
		}

		/* --- Footer con atajos --- */
		curY += FOOTER_GAP
		ctx.font = HINT_FONT
		const hints = []
		if (this.currentOptions) {
			hints.push({ label: 'Q', text: 'Elegir' })
		} else {
			hints.push({ label: 'E', text: 'Avanzar' })
		}
		hints.push({ label: 'W/S', text: 'Navegar' })
		hints.push({ label: 'Esc', text: 'Cerrar' })

		// Calcular ancho total y centrar
		const hintParts = []
		let totalHintWidth = 0
		for (const h of hints) {
			ctx.font = HINT_FONT
			const labelW = ctx.measureText(h.label).width
			const textW = ctx.measureText(h.text).width
			const partWidth = labelW + 4 + textW
			hintParts.push({ ...h, labelW, textW, partWidth })
			totalHintWidth += partWidth
			if (h !== hints[hints.length - 1]) totalHintWidth += 28
		}

		let hintX = x + (boxWidth - totalHintWidth) / 2
		const hintY = curY + HINT_SIZE
		for (let i = 0; i < hintParts.length; i++) {
			const p = hintParts[i]
			ctx.fillStyle = THEME.textKey
			ctx.fillText(p.label, hintX, hintY)
			hintX += p.labelW + 4
			ctx.fillStyle = THEME.textHint
			ctx.fillText(p.text, hintX, hintY)
			hintX += p.textW
			if (i < hintParts.length - 1) {
				const sep = '·'
				ctx.fillStyle = THEME.textHint
				ctx.fillText(sep, hintX + 6, hintY)
				hintX += 28
			}
		}
	}

	/* ============================================================
	 * Helpers privados
	 * ============================================================ */

	/**
	 * Word-wrap de un texto a varias líneas que no excedan `maxWidth`
	 * (en píxeles) según la fuente actual del contexto. Respeta los
	 * saltos de línea explícitos (`\n`).
	 */
	#wrapText(ctx, text, maxWidth) {
		if (!text) return []
		const lines = []
		for (const paragraph of text.split(/\n/)) {
			const words = paragraph.split(/\s+/).filter((w) => w.length > 0)
			let current = ''
			for (const word of words) {
				const test = current ? `${current} ${word}` : word
				if (ctx.measureText(test).width > maxWidth && current) {
					lines.push(current)
					current = word
				} else {
					current = test
				}
			}
			if (current) lines.push(current)
		}
		return lines
	}

	/** Nombre legible del NPC. Prioriza `npc.name`, luego deriva de `id`. */
	#getNPCName() {
		if (!this.currentNPC) return null
		if (this.currentNPC.name) return this.currentNPC.name
		const id = this.currentNPC.id
		if (!id) return null
		return String(id)
			.split('_')
			.map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
			.join(' ')
	}

	/**
	 * Wrapper local sobre `components/internal/canvas.js#roundRect` para
	 * que el `render` siga siendo autocontenido (no hay dependencias
	 * circulares: este manager no expone este helper).
	 */
	#roundRect(ctx, x, y, w, h, r) {
		roundRect(ctx, x, y, w, h, r)
	}
}
