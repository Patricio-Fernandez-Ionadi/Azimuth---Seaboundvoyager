import { Shop } from '../components/Shop.js'

export class NPC {
	constructor({ x, y, color, dialogs = [], game, shopConfig = null }) {
		this.game = game
		this.x = x
		this.y = y
		this.width = 32
		this.height = 32
		this.color = color
		this.dialogs = dialogs // Array de mensajes
		this.isInteracting = false

		// console.log(shopConfig)
		this.shop = shopConfig ? new Shop(this, shopConfig) : null
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
