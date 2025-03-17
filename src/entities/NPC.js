import { Inventory } from '../components/inventory/Inventory.js'

export class NPC {
	constructor(x, y, color, dialogs = [], inventory = [], game) {
		this.game = game
		this.x = x
		this.y = y
		this.width = 32
		this.height = 32
		this.color = color
		this.dialogs = dialogs // Array de mensajes

		this.isInteracting = false
		this.inventory = new Inventory(this, 10, 50)

		if (inventory.length > 0) {
			inventory.forEach((item) => {
				this.inventory.addItem(
					item,
					Math.floor(Math.random() * item.maxStack) + 1
				)
			})
		}
	}

	draw(ctx, camera) {
		ctx.fillStyle = this.color
		ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height)
	}

	interact() {
		if (!this.isInteracting) {
			this.isInteracting = true
			this.game.eventSystem.emit('npcInteracted', this)
		}
	}

	endInteraction() {
		this.isInteracting = false
		this.game.eventSystem.emit('interactionEnded', this)
	}
}
