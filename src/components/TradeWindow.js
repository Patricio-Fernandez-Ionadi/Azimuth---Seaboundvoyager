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
		// Verificar si el NPC tiene una tienda
		if (this.npc.shop) {
			this.npcInventory = this.npc.shop.inventory
		} else {
			this.npcInventory = this.npc.inventory
		}
	}

	draw(ctx) {
		if (!this.isOpen) return

		ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
		ctx.fillRect(this.x, this.y, this.width, this.height)

		this.npcInventory.draw(ctx)
		this.player.inventory.draw(ctx)
	}

	mouseDown(mouseX, mouseY) {
		if (!this.isOpen) return
		this.npcInventory.mouseDown(mouseX, mouseY)
	}

	mouseMove(mouseX, mouseY) {
		if (!this.isOpen) return
		this.npcInventory.mouseMove(mouseX, mouseY)
	}

	mouseUp(mouseX, mouseY) {}

	/* buyItem(mouseX, mouseY) {
		for (let row = 0; row < this.npcInventory.rows; row++) {
			for (let col = 0; col < this.npcInventory.cols; col++) {
				const slot = this.npcInventory.slots[row][col]
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
	} */

	close() {
		this.isOpen = false
		this.game.eventSystem.emit('tradeWindowClosed')
	}
}
