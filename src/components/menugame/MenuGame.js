import { Panel } from '../Panel.js'
import { Tabs } from '../Tabs.js'
import { ScrollableArea } from '../ScrollableArea.js'
import { Text } from '../Text.js'
import { THEME } from '../theme.js'
import { fontStyles } from '../../core/fonts.js'

const TABS = ['Inventario', 'Crear', 'Estadisticas', 'Misiones', 'Logros']

/**
 * MenuGame
 * ----------------------------------------------------------------------
 * Menú in-game con tabs (Inventario, Crear, Estadísticas, Misiones,
 * Logros). La caja exterior es un `Panel` temático (sin pildora: la
 * tab activa indica la sección). La tira de tabs es el componente
 * `Tabs`. El contenido de los tabs que pueden exceder el alto del
 * panel (Estadísticas, Misiones) usa un `ScrollableArea` con scrollbar
 * y soporte para rueda del mouse.
 *
 * Geometría:
 *   x = (W - 0.9*W) / 2  →  centrado
 *   width = 0.9 * W
 *   height = 0.9 * H
 *
 * Animación: el menu desliza horizontalmente modificando `this.x` (sin
 * usar `ctx.translate`), de modo que las coordenadas de mouse y de
 * dibujo siempre coinciden. El inventario del jugador se reposiciona
 * solo cuando el menu llega a su posición final.
 */
export class MenuGame {
	constructor(player) {
		this.player = player
		this.game = player.game
		this.c = player.game.ctx
		this.isOpen = false
		this.tabs = new Tabs({
			tabs: TABS,
			selected: 0,
			onSelect: (i) => {
				this.selectedTab = TABS[i]
				this.#resetScroll()
			},
		})
		this.selectedTab = TABS[0]

		/* Geometría de la caja del menú (centrado) */
		this.width = this.game.width * 0.9
		this.height = this.game.height * 0.9
		this.targetX = (this.game.width - this.width) / 2
		this.x = this.game.width + 10 /* empieza fuera, a la derecha */
		this.y = (this.game.height - this.height) / 2

		/* Layout interno */
		this.padding = 14
		this.tabHeight = 36
		this.tabsGap = 8
		this.trashSize = 56

		/* Animación: actualiza this.x directamente */
		this.animationSpeed = 45

		/* Estado del inventario: solo se dibuja cuando el menu está
		 * abierto. Cerrado → oculto (no se ve en el HUD). */
		this._drawInventory = false

		/* Scroll: un ScrollableArea por tab que pueda overflowear. */
		this._scrollAreas = {}

		this.game.eventSystem.on('toggle_menugame', () => {
			this.toggle()
		})
	}

	/* ============================================================
	 * Geometría derivada
	 * ============================================================ */

	get contentTopY() {
		return this.y + this.padding + this.tabHeight + this.tabsGap
	}

	get contentLeftX() {
		return this.x + this.padding
	}

	get contentWidth() {
		return this.width - this.padding * 2
	}

	get contentHeight() {
		return (
			this.height -
			this.padding -
			this.tabHeight -
			this.tabsGap -
			this.padding
		)
	}

	#scrollAreaFor(tabName) {
		if (this._scrollAreas[tabName]) return this._scrollAreas[tabName]
		/* Tamaño provisional; el tab lo recrea con su altura real. */
		const area = new ScrollableArea({
			x: this.contentLeftX,
			y: this.contentTopY,
			width: this.contentWidth,
			height: this.contentHeight,
			contentHeight: 1, /* se actualiza en cada render */
		})
		this._scrollAreas[tabName] = area
		return area
	}

	#resetScroll() {
		const area = this._scrollAreas[this.selectedTab]
		if (area) area.reset()
	}

	/* ============================================================
	 * Update
	 * ============================================================ */

	update() {
		if (this.isOpen) {
			if (this.x > this.targetX) {
				this.x = Math.max(this.targetX, this.x - this.animationSpeed)
			}
			if (this.x === this.targetX && !this._drawInventory) {
				this.#repositionInventory()
				this._drawInventory = true
			}
		} else {
			if (this.x < this.game.width + 10) {
				this.x = Math.min(this.game.width + 10, this.x + this.animationSpeed)
			}
			/* Menu cerrado → el inventario queda oculto. Reseteamos
			 * la posición para tener un estado consistente, pero no
			 * lo dibujamos. */
			if (this.x === this.game.width + 10 && this._drawInventory) {
				this.#resetInventory()
				this._drawInventory = false
			}
		}
	}

	#repositionInventory() {
		const rows = 10
		const cols = 8
		const slotSize = Math.max(20, Math.floor(this.contentHeight / rows))

		/* Deja lugar para la papelera a la izquierda. */
		const inventoryW = slotSize * cols
		const inventoryX = this.contentLeftX + (this.contentWidth - inventoryW)

		this.player.inventory.slotSize = slotSize
		this.player.inventory.x = inventoryX
		this.player.inventory.y = this.contentTopY
		this.player.inventory.setGrid(rows, cols)
	}

	#resetInventory() {
		/* HUD: inventario compacto en la esquina superior derecha.
		 * slotSize menor al del menu para no dominar la pantalla. */
		const hudSlotSize = 28
		this.player.inventory.slotSize = hudSlotSize
		this.player.inventory.x = this.game.width - hudSlotSize * 10 - 8
		this.player.inventory.y = 8
		this.player.inventory.setGrid(10, 8)
	}

	/* ============================================================
	 * Render
	 * ============================================================ */

	render() {
		/* Panel + tabs + contenido: se dibuja mientras el menu esté
		 * abierto O animando (en cualquier dirección). Si ya terminó
		 * de salir (x totalmente off-screen y cerrado), no se dibuja. */
		const isAnimatingIn = this.isOpen && this.x > this.targetX
		const isAnimatingOut = !this.isOpen && this.x < this.game.width + 10
		const drawPanel = this.isOpen || isAnimatingIn || isAnimatingOut

		if (drawPanel) {
			const panel = new Panel({
				x: this.x,
				y: this.y,
				width: this.width,
				height: this.height,
				padding: this.padding,
			})
			const inner = panel.draw(this.c)

			this.tabs.x = inner.x
			this.tabs.y = inner.y
			this.tabs.width = inner.width
			this.tabs.height = this.tabHeight
			this.tabs.draw(this.c)

			const contentY = inner.y + this.tabHeight + this.tabsGap
			const contentH = inner.y + inner.height - contentY
			if (contentH > 0) {
				this.#drawTabContent(this.c, inner.x, contentY, inner.width, contentH)
			}
		}

		/* Inventario: solo se dibuja con menu totalmente abierto Y en
		 * la tab "Inventario". En las otras tabs se ve el contenido
		 * propio de cada tab. */
		if (this._drawInventory && this.selectedTab === 'Inventario') {
			this.player.inventory.draw()
			/* Tooltip por encima de todo (incluyendo el panel si el
			 * item está cerca del borde). */
			this.player.inventory.drawTooltip()
		}
	}

	#drawTabContent(c, x, y, w, h) {
		switch (this.selectedTab) {
			case 'Inventario':
				this.#drawInventoryTab(c, x, y, w, h)
				break
			case 'Crear':
				this.#drawCraftingTab(c, x, y, w, h)
				break
			case 'Estadisticas':
				this.#drawStatsTab(c, x, y, w, h)
				break
			case 'Misiones':
				this.#drawQuestsTab(c, x, y, w, h)
				break
			case 'Logros':
				this.#drawAchievementsTab(c, x, y, w, h)
				break
		}
	}

	/* ============================================================
	 * Tabs (cada uno puede ser scrollable o no)
	 * ============================================================ */

	#drawInventoryTab(c, x, y, w, h) {
		const trashSize = this.trashSize
		const trashX = x + 4
		const trashY = y + 4

		/* Papelera */
		c.fillStyle = 'rgba(120, 30, 30, 0.55)'
		c.fillRect(trashX, trashY, trashSize, trashSize)
		c.strokeStyle = THEME.borderInner
		c.lineWidth = 1.5
		c.strokeRect(trashX + 0.5, trashY + 0.5, trashSize - 1, trashSize - 1)
		c.fillStyle = '#f4e4c1'
		c.font = `bold 12px ${fontStyles.body.name}, Arial, sans-serif`
		c.textAlign = 'center'
		c.textBaseline = 'middle'
		c.fillText('Tirar', trashX + trashSize / 2, trashY + trashSize / 2)
		c.textAlign = 'left'
		c.textBaseline = 'alphabetic'

		/* El inventario NO se dibuja acá; lo dibuja `render()` al final
		 * según `_drawInventory` y la posición actual del inventario
		 * (HUD o dentro del menu). Ver bloque final de `render()`. */
	}

	#drawCraftingTab(c, x, y, w, h) {
		Text({
			ctx: c,
			x: x + 12,
			y: y + 24,
			size: 18,
			label: 'Crafteo',
			color: THEME.selected,
		})

		const inputSize = Math.min(100, h - 80)
		const inputX = x + 30
		const inputY = y + 50
		c.fillStyle = 'rgba(80, 60, 140, 0.45)'
		c.fillRect(inputX, inputY, inputSize, inputSize)
		c.strokeStyle = THEME.borderInner
		c.lineWidth = 1.5
		c.strokeRect(inputX + 0.5, inputY + 0.5, inputSize - 1, inputSize - 1)
		c.fillStyle = THEME.textHint
		c.font = `12px ${fontStyles.body.name}, Arial, sans-serif`
		c.textAlign = 'center'
		c.fillText('Materiales', inputX + inputSize / 2, inputY + inputSize + 18)
		c.textAlign = 'left'

		const btnW = 150
		const btnH = 50
		const btnX = x + w - btnW - 30
		const btnY = y + h - btnH - 20
		c.fillStyle = THEME.buttonIdleBg
		c.fillRect(btnX, btnY, btnW, btnH)
		c.strokeStyle = THEME.borderInner
		c.lineWidth = 2
		c.strokeRect(btnX + 1, btnY + 1, btnW - 2, btnH - 2)

		c.fillStyle = THEME.text
		c.font = `bold 22px ${fontStyles.body.name}, Arial, sans-serif`
		c.textAlign = 'center'
		c.textBaseline = 'middle'
		c.fillText('Crear', btnX + btnW / 2, btnY + btnH / 2)
		c.textAlign = 'left'
		c.textBaseline = 'alphabetic'
	}

	#drawStatsTab(c, x, y, w, h) {
		const p = this.player
		const labelSize = 18
		const rowHeight = 38
		const sectionGap = 30
		const titleSize = 22
		const titleGap = 8

		/* Calcular altura total del contenido (natural, sin clip) */
		const skills = p.skills ?? {}
		const skillKeys = Object.keys(skills)
		const aff = p.affinities ?? {}
		const affKeys = Object.keys(aff)
		const skillsH = titleSize + titleGap + skillKeys.length * rowHeight
		const affH = titleSize + titleGap + affKeys.length * rowHeight
		const contentH = skillsH + sectionGap + affH

		/* ScrollableArea: si entra, se ve entero; si no, scroll */
		const area = this.#scrollAreaFor('Estadisticas')
		area.x = x
		area.y = y
		area.width = w
		area.height = h
		area.contentHeight = contentH

		area.draw(c, (c, cx, cy, cw, ch) => {
			/* Título skills */
			Text({
				ctx: c,
				x: cx + 12,
				y: cy + titleSize,
				size: titleSize,
				label: 'Habilidades',
				color: THEME.selected,
			})

			const barW = cw * 0.55
			skillKeys.forEach((key, i) => {
				const s = skills[key]
				const rowY = cy + titleSize + titleGap + i * rowHeight
				const barX = cx + 20

				Text({
					ctx: c,
					x: barX,
					y: rowY + labelSize / 2,
					size: labelSize,
					label: this.#formatKey(key),
					color: THEME.text,
				})

				const barY = rowY + 6
				c.fillStyle = '#333'
				c.fillRect(barX + 160, barY, barW, 16)
				c.fillStyle = THEME.selected
				c.fillRect(barX + 160, barY, barW * (s.value / 100), 16)

				Text({
					ctx: c,
					x: barX + 160 + barW + 10,
					y: barY + labelSize / 2,
					size: labelSize,
					label: `${s.value}`,
					color: THEME.text,
				})
			})

			/* Título afinidad */
			const affTitleY = cy + titleSize + titleGap + skillKeys.length * rowHeight + sectionGap
			Text({
				ctx: c,
				x: cx + 12,
				y: affTitleY,
				size: titleSize,
				label: 'Afinidad',
				color: THEME.selected,
			})

			affKeys.forEach((key, i) => {
				const value = aff[key]
				const rowY = affTitleY + titleGap + i * rowHeight
				const isMain = p.mainAffinity === key
				const isSecondary = p.secondaryAffinity === key
				const lvlX = cx + 200

				Text({
					ctx: c,
					x: cx + 20,
					y: rowY + labelSize / 2,
					size: labelSize,
					label:
						this.#formatKey(key) +
						(isMain ? ' (principal)' : isSecondary ? ' (secundaria)' : ''),
					color: THEME.text,
				})

				for (let lvl = 0; lvl < 10; lvl++) {
					c.fillStyle = lvl < value ? this.#affinityColor(key) : '#333'
					c.fillRect(lvlX + lvl * 18, rowY + 6, 14, 14)
				}
			})
		})
	}

	#drawQuestsTab(c, x, y, w, h) {
		const qm = this.game.questManager
		const active = qm?.getActiveQuests?.() ?? []
		const completed = Array.from(qm?.completedQuests ?? [])
		const rowHeight = 60
		const titleSize = 22
		const titleGap = 10
		const sectionGap = 20
		const padTop = 16

		/* Alturas naturales */
		const activeTitleH = titleSize + titleGap
		const activeRowsH = Math.max(rowHeight, active.length * rowHeight)
		const completedTitleH = active.length === 0 ? 0 : titleSize + titleGap
		const completedRowsH = Math.max(
			0,
			completed.length * 26 + (completed.length === 0 ? 30 : 0),
		)
		const contentH =
			padTop + activeTitleH + activeRowsH + sectionGap + completedTitleH + completedRowsH

		const area = this.#scrollAreaFor('Misiones')
		area.x = x
		area.y = y
		area.width = w
		area.height = h
		area.contentHeight = contentH

		area.draw(c, (c, cx, cy, cw, ch) => {
			let curY = cy + padTop

			Text({
				ctx: c,
				x: cx + 20,
				y: curY + titleSize,
				size: titleSize,
				label: 'Misiones activas',
				color: THEME.selected,
			})
			curY += activeTitleH

			if (active.length === 0) {
				Text({
					ctx: c,
					x: cx + 24,
					y: curY + 16,
					size: 16,
					label: 'No hay misiones activas.',
					color: THEME.textDim,
				})
				curY += rowHeight
			} else {
				active.forEach((q) => {
					Text({
						ctx: c,
						x: cx + 24,
						y: curY + 18,
						size: 18,
						label: `• ${q.title} (${q.branch})`,
						color: THEME.text,
					})
					const step = q.steps?.[q.currentStep]
					if (step?.description) {
						Text({
							ctx: c,
							x: cx + 44,
							y: curY + 40,
							size: 14,
							label: `→ ${step.description}`,
							color: THEME.textDim,
						})
					}
					curY += rowHeight
				})
			}

			if (active.length > 0) {
				curY += sectionGap
				Text({
					ctx: c,
					x: cx + 20,
					y: curY + titleSize,
					size: titleSize,
					label: 'Misiones completadas',
					color: THEME.selected,
				})
				curY += completedTitleH

				if (completed.length === 0) {
					Text({
						ctx: c,
						x: cx + 24,
						y: curY + 16,
						size: 16,
						label: '—',
						color: THEME.textHint,
					})
				} else {
					completed.forEach((qId) => {
						const q = qm.getById(qId)
						Text({
							ctx: c,
							x: cx + 24,
							y: curY + 16,
							size: 16,
							label: `✓ ${q?.title ?? qId}`,
							color: THEME.textDim,
						})
						curY += 26
					})
				}
			}
		})
	}

	#drawAchievementsTab(c, x, y, w, h) {
		Text({
			ctx: c,
			x: x + 12,
			y: y + 24,
			size: 22,
			label: 'Logros',
			color: THEME.selected,
		})
		const achievements = ['Explorador', 'Artesano', 'Héroe']
		achievements.forEach((achievement, idx) => {
			Text({
				ctx: c,
				x: x + 24,
				y: y + 56 + idx * 40,
				size: 18,
				label: `• ${achievement}`,
				color: THEME.text,
			})
		})
	}

	/* ============================================================
	 * Helpers
	 * ============================================================ */

	#formatKey(key) {
		const map = {
			perspicacia: 'Perspicacia',
			negociacion: 'Negociación',
			destreza: 'Destreza',
			rebeldia: 'Rebeldía',
			prestigio: 'Prestigio',
			asombro: 'Asombro',
		}
		return map[key] ?? key
	}

	#affinityColor(key) {
		const colors = {
			rebeldia: '#c0392b',
			prestigio: '#f1c40f',
			asombro: '#9b59b6',
		}
		return colors[key] ?? '#888'
	}

	/* ============================================================
	 * Toggle / eventos
	 * ============================================================ */

	toggle() {
		this.isOpen = !this.isOpen
		if (this.isOpen) {
			/* Posición inicial fuera de pantalla; update() lo desliza.
			 * Ocultamos el inventario durante la animación para que no
			 * "flashee" en posición HUD mientras el menu desliza. */
			this.x = this.game.width + 10
			this._drawInventory = false
		} else {
			/* Al cerrar, reseteamos el inventario a la posición del HUD
			 * inmediatamente. Seguimos ocultándolo hasta que el menu
			 * salga totalmente de pantalla. */
			this.#resetInventory()
			this._drawInventory = false
		}
	}

	mouseDown(mouseX, mouseY, e) {
		if (!this.isOpen) return
		/* Si la click cae dentro del panel, lo absorbemos */
		if (
			mouseX < this.x ||
			mouseX > this.x + this.width ||
			mouseY < this.y ||
			mouseY > this.y + this.height
		) {
			return
		}
		/* Primero: scrollbar del tab activo. */
		const area = this._scrollAreas[this.selectedTab]
		if (area && area.handleMouseDown(mouseX, mouseY)) return
		/* Después: tabs. */
		this.tabs.handleClick(mouseX, mouseY)
	}

	mouseMove(mouseX, mouseY, e) {
		if (!this.isOpen) return
		const area = this._scrollAreas[this.selectedTab]
		if (area) area.handleMouseMove(mouseX, mouseY)
		this.tabs.handleHover(mouseX, mouseY)
	}

	mouseUp(mouseX, mouseY, e) {
		if (!this.isOpen) return
		const area = this._scrollAreas[this.selectedTab]
		if (area) area.handleMouseUp()
		/* Drop en la papelera (Inventario tab) */
		if (this.selectedTab !== 'Inventario') return
		const trashSize = this.trashSize
		const trashX = this.x + this.padding + 4
		const trashY = this.contentTopY + 4
		if (
			mouseX > trashX &&
			mouseX < trashX + trashSize &&
			mouseY > trashY &&
			mouseY < trashY + trashSize
		) {
			// TODO: eliminar el item arrastrado (player.inventory.draggedItem)
			console.log('soltado en trash')
		}
	}

	wheel(e) {
		if (!this.isOpen) return
		/* Solo si la rueda cae dentro del panel. */
		if (
			e.offsetX < this.x ||
			e.offsetX > this.x + this.width ||
			e.offsetY < this.y ||
			e.offsetY > this.y + this.height
		) {
			return
		}
		const area = this._scrollAreas[this.selectedTab]
		if (area) area.handleWheel(e.deltaY)
	}
}
