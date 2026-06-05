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
 * La presentación gráfica (caja de texto, opciones) la hace este manager.
 * La aplicación de efectos se delega a QuestManager.applyEffect cuando
 * es posible, pero el manager también los aplica directamente para
 * opciones que no son parte de una quest.
 */

export class DialogManager {
	constructor(game) {
		this.game = game
		this.eventSystem = this.game.eventSystem
		this.currentNPC = null
		this.currentMessageIndex = 0
		this.selectedOptionIndex = 0
		this.currentMessage = null
		this.currentOptions = null
	}

	/* ============================================================
	 * Ciclo de diálogo
	 * ============================================================ */

	startDialogue(npc) {
		this.currentNPC = npc
		this.currentMessageIndex = 0
		this.selectedOptionIndex = 0
		this.#showNode()
	}

	/**
	 * Avanza el diálogo desde el estado actual.
	 * Llamado cuando el jugador presiona E con un NPC en interacción.
	 * - Si el nodo actual tiene `next` (no opciones), salta al target.
	 * - Si el nodo actual es de opciones, no hace nada (debe elegir).
	 * - En otro caso, incrementa el índice y muestra el siguiente.
	 */
	advanceDialogue() {
		if (!this.currentNPC) return

		const node = this.currentNPC.dialogs[this.currentMessageIndex]
		if (!node) {
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

		const node = this.currentNPC.dialogs[this.currentMessageIndex]
		if (!node) {
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
			this.currentNPC.endInteraction()
			this.currentNPC = null
			this.currentMessageIndex = 0
			this.selectedOptionIndex = 0
			this.currentMessage = null
			this.currentOptions = null
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
	 * Render (sin cambios significativos; caja simple)
	 * ============================================================ */

	renderDialogBox() {
		if (!this.currentMessage) return
		const { ctx } = this.game

		const padding = 20
		const boxWidth = 400
		const boxHeight = 100
		const x = (this.game.width - boxWidth) / 2
		const y = this.game.height - boxHeight - padding

		ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
		ctx.fillRect(x, y, boxWidth, boxHeight)

		ctx.save()
		ctx.fillStyle = 'white'
		ctx.font = '16px Arial'
		ctx.fillText(this.currentMessage, x + padding, y + padding + 20)
		ctx.restore()
	}

	renderOptionsBox() {
		if (!this.currentOptions) return
		const { ctx } = this.game

		const padding = 20
		const boxWidth = 400
		const boxHeight = 20 + this.currentOptions.length * 30
		const x = (this.game.width - boxWidth) / 2
		const y = this.game.height - 50 - padding

		ctx.fillStyle = 'rgba(228, 7, 7, 0.62)'
		ctx.fillRect(x, y, boxWidth, boxHeight)

		ctx.save()
		this.currentOptions.forEach((option, index) => {
			ctx.fillStyle = this.selectedOptionIndex === index ? 'yellow' : 'white'
			ctx.font = '16px Arial'
			const text = option.text ?? option.label ?? '(sin texto)'
			ctx.fillText(text, x + padding, y + padding + 30 * index)
		})
		ctx.restore()

		if (this.game.keyboard.onPress.escape) {
			this.endDialogue()
		}
	}
}
