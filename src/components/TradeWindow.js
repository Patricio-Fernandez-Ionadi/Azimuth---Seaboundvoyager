export class TradeWindow {
	constructor(game, player, npc) {
		this.game = game
		this.player = player
		this.npc = npc
		this.x = 0
		this.y = 0
		this.width = this.game.width
		this.height = 800
		this.isOpen = true

		this.player.inventory.isOpen = true
		this.npc.inventory.isOpen = true
	}

	draw(ctx) {
		if (!this.isOpen) return

		ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
		ctx.fillRect(this.x, this.y, this.width, this.height)

		this.npc.inventory.draw(ctx)
		this.player.inventory.draw(ctx)
	}

	mouseDown(mouseX, mouseY) {
		if (!this.isOpen) return
		this.npc.inventory.mouseDown(mouseX, mouseY)

		// // Manejar clics en el inventario del NPC
		// const npcSlotClicked = this.npc.inventory.slots.some((row) =>
		// 	row.some((slot) => slot.handleClick(mouseX, mouseY))
		// )
		// if (npcSlotClicked) {
		// 	this.buyItem(mouseX, mouseY)
		// }
	}

	mouseMove(mouseX, mouseY) {
		if (!this.isOpen) return
		this.npc.inventory.mouseMove(mouseX, mouseY)
	}

	mouseUp(mouseX, mouseY) {}

	buyItem(mouseX, mouseY) {
		for (let row = 0; row < this.npc.inventory.rows; row++) {
			for (let col = 0; col < this.npc.inventory.cols; col++) {
				const slot = this.npc.inventory.slots[row][col]
				if (slot.handleClick(mouseX, mouseY) && slot.item) {
					if (!slot.item.price) {
						console.warn(`El ítem ${slot.item.name} no tiene precio`)
						return
					}
					const price = slot.item.price || 10 // Precio por defecto
					if (this.player.resources.gold >= price) {
						this.player.resources.gold -= price
						this.player.inventory.addItem(slot.item, 1)
						console.log(`Comprado: ${slot.item.name}`)
					} else {
						console.warn('No tienes suficiente oro para comprar este ítem')
					}
					return
				}
			}
		}
	}

	close() {
		this.isOpen = false
		this.player.inventory.isOpen = false
		this.npc.inventory.isOpen = false
		this.game.eventSystem.emit('tradeWindowClosed')
	}
}
