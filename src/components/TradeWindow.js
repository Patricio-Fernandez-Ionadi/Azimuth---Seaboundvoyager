import { Panel } from './Panel.js'
import { THEME } from './theme.js'
import { Text } from './Text.js'
import { fontStyles } from '../core/fonts.js'

/**
 * TradeWindow
 * ----------------------------------------------------------------------
 * Overlay de comercio entre el jugador y un NPC. Muestra dos inventarios
 * lado a lado con el mismo tamaño (mismo slotSize, mismas filas/columnas),
 * dentro de un `Panel` temático con título, labels, oro del jugador y
 * hint de cierre.
 *
 * Layout:
 *   ┌─────────────────────────────────────────────┐
 *   │  Tienda de [NPC]                             │
 *   │                                             │
 *   │  Vendedor        │  Tú                      │
 *   │  ┌──┬──┬──┬──┐    │  ┌──┬──┬──┬──┐          │
 *   │  │  │  │  │  │    │  │  │  │  │  │          │
 *   │  ├──┼──┼──┼──┤    │  ├──┼──┼──┼──┤          │
 *   │  │  │  │  │  │    │  │  │  │  │  │          │
 *   │  └──┴──┴──┴──┘    │  └──┴──┴──┴──┘          │
 *   │                                             │
 *   │  Tu oro: $XXX                               │
 *   │  Click para comprar/vender · Esc cerrar     │
 *   └─────────────────────────────────────────────┘
 *
 * El inventario del jugador se redimensiona a 8×6 durante el trade y se
 * restaura a 10×8 al cerrar (los items se preservan, solo cambia el
 * `slotSize`/grid de visualización).
 */
export class TradeWindow {
	constructor(game, player, npc) {
		this.game = game
		this.player = player
		this.npc = npc
		this.isOpen = true

		this.npcInventory = this.npc.shop?.inventory ?? this.npc.inventory

		/* Guardamos la geometría original del inventario del jugador
		 * para restaurarla al cerrar. */
		this._savedPlayerInv = {
			x: this.player.inventory.x,
			y: this.player.inventory.y,
			slotSize: this.player.inventory.slotSize,
			rows: this.player.inventory.rows,
			cols: this.player.inventory.cols,
		}

		/* Layout: ambos inventarios con el mismo tamaño */
		this.invCols = 8
		this.invRows = 6
		this.slotSize = 40
		this.invGap = 24
		this.padding = 18
		this.titleHeight = 28
		this.titleGap = 10
		this.labelsHeight = 18
		this.labelsGap = 6
		this.footerHeight = 60

		const invW = this.slotSize * this.invCols
		const invH = this.slotSize * this.invRows
		this.contentWidth = invW * 2 + this.invGap
		this.contentHeight = invH

		this.panelWidth = this.contentWidth + this.padding * 2
		this.panelHeight =
			this.titleHeight +
			this.titleGap +
			this.labelsHeight +
			this.labelsGap +
			invH +
			this.footerHeight +
			this.padding

		this.x = (this.game.width - this.panelWidth) / 2
		this.y = (this.game.height - this.panelHeight) / 2

		this.#layoutInventories()
	}

	/* ============================================================
	 * Geometría
	 * ============================================================ */

	#inventoryTopY() {
		return this.y + this.padding + this.titleHeight + this.titleGap + this.labelsHeight + this.labelsGap
	}

	#layoutInventories() {
		const topY = this.#inventoryTopY()

		/* NPC inventory (izquierda) */
		this.npcInventory.slotSize = this.slotSize
		this.npcInventory.x = this.x + this.padding
		this.npcInventory.y = topY
		this.npcInventory.setGrid(this.invRows, this.invCols)

		/* Player inventory (derecha) */
		this.player.inventory.slotSize = this.slotSize
		this.player.inventory.x = this.x + this.padding + this.slotSize * this.invCols + this.invGap
		this.player.inventory.y = topY
		this.player.inventory.setGrid(this.invRows, this.invCols)
	}

	#restorePlayerInventory() {
		const inv = this.player.inventory
		inv.slotSize = this._savedPlayerInv.slotSize
		inv.x = this._savedPlayerInv.x
		inv.y = this._savedPlayerInv.y
		inv.setGrid(this._savedPlayerInv.rows, this._savedPlayerInv.cols)
	}

	/* ============================================================
	 * Render
	 * ============================================================ */

	draw(ctx) {
		if (!this.isOpen) return

		/* Backdrop semitransparente */
		ctx.fillStyle = 'rgba(0, 0, 0, 0.55)'
		ctx.fillRect(0, 0, this.game.width, this.game.height)

		/* Panel temático con título */
		const panel = new Panel({
			x: this.x,
			y: this.y,
			width: this.panelWidth,
			height: this.panelHeight,
			title: `Tienda de ${this.#npcName()}`,
			padding: this.padding,
		})
		const inner = panel.draw(ctx)

		/* Labels sobre cada inventario */
		const invTopY = this.#inventoryTopY()
		Text({
			ctx,
			x: this.x + this.padding,
			y: invTopY - this.labelsGap,
			size: this.labelsHeight,
			label: 'Vendedor',
			color: THEME.textHint,
		})
		Text({
			ctx,
			x: this.x + this.padding + this.slotSize * this.invCols + this.invGap,
			y: invTopY - this.labelsGap,
			size: this.labelsHeight,
			label: 'Tú',
			color: THEME.textHint,
		})

		/* Inventarios: primero los slots de ambos, después los tooltips
		 * por encima de todo (así el tooltip del vendedor no queda
		 * tapado por el inventario del jugador cuando están cerca). */
		this.npcInventory.draw()
		this.player.inventory.draw()
		this.npcInventory.drawTooltip(ctx)
		this.player.inventory.drawTooltip(ctx)

		/* Footer: oro + hint */
		const footerY = invTopY + this.slotSize * this.invRows + 14
		Text({
			ctx,
			x: inner.x,
			y: footerY,
			size: 18,
			label: `Tu oro: $${this.player.resources.gold ?? 0}`,
			color: THEME.selected,
			weight: 'bold',
		})
		Text({
			ctx,
			x: inner.x,
			y: footerY + 24,
			size: 12,
			label: 'Click en un item del vendedor para comprar · Click en tu item para vender · Esc para cerrar',
			color: THEME.textHint,
		})
	}

	#npcName() {
		if (this.npc.name) return this.npc.name
		if (this.npc.id) {
			return this.npc.id
				.split('_')
				.map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
				.join(' ')
		}
		return 'NPC'
	}

	/* ============================================================
	 * Eventos
	 * ============================================================ */

	mouseDown(mouseX, mouseY) {
		if (!this.isOpen) return
		this.npcInventory.mouseDown(mouseX, mouseY)
		this.player.inventory.mouseDown(mouseX, mouseY)
	}

	mouseMove(mouseX, mouseY) {
		if (!this.isOpen) return
		this.npcInventory.mouseMove(mouseX, mouseY)
		this.player.inventory.mouseMove(mouseX, mouseY)
	}

	mouseUp(mouseX, mouseY) {
		if (!this.isOpen) return
		this.npcInventory.mouseUp(mouseX, mouseY)
		this.player.inventory.mouseUp(mouseX, mouseY)
	}

	close() {
		if (!this.isOpen) return
		this.isOpen = false
		this.#restorePlayerInventory()
		this.game.eventSystem.emit('tradeWindowClosed')
	}
}
