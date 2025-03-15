export class NPC {
	constructor(x, y, color, dialogs = [], eventSystem) {
		this.x = x
		this.y = y
		this.width = 32
		this.height = 32
		this.color = color
		this.dialogs = dialogs // Array de mensajes
		this.eventSystem = eventSystem

		this.isInteracting = false
	}

	draw(ctx, camera) {
		ctx.fillStyle = this.color
		ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height)
	}

	interact() {
		if (!this.isInteracting) {
			this.isInteracting = true
			// Emitir evento de inicio de interacción
			this.eventSystem.emit('npcInteracted', this)
		}
	}

	endInteraction() {
		this.isInteracting = false
		// Emitir evento de fin de interacción
		this.eventSystem.emit('interactionEnded', this)
	}
}
