export class NPC {
	constructor(x, y, color, dialogs = [], eventSystem) {
		this.x = x
		this.y = y
		this.width = 32
		this.height = 32
		this.color = color
		this.dialogs = dialogs // Array de mensajes
		this.eventSystem = eventSystem

		this.currentMessage = null
		this.currentDialogIndex = 0

		this.isInteracting = false
		this.waitingForInput = false

		this.currentOptions = null // Guardará las opciones del diálogo actual
	}

	draw(ctx, camera) {
		ctx.fillStyle = this.color
		ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height)
	}

	interact() {
		if (!this.isInteracting) {
			this.isInteracting = true
			this.currentDialogIndex = 0
			this.currentOptions = null
			this.currentMessage = this.dialogs[this.currentDialogIndex] || null
			this.waitingForInput = true

			// Emitir evento de inicio de interacción
			this.eventSystem.emit('npcInteracted', { npc: this })
		}
	}

	getNextMessage() {
		if (this.currentDialogIndex < this.dialogs.length) {
			const dialog = this.dialogs[this.currentDialogIndex]

			// Si el diálogo es un objeto con opciones, las almacenamos
			if (typeof dialog === 'object' && dialog.message && dialog.options) {
				this.currentOptions = dialog.options
				return dialog.message
			}

			this.currentOptions = null
			return dialog
		} else {
			this.endInteraction()
			return null
		}
	}

	selectOption(index) {
		if (
			this.currentOptions &&
			this.currentOptions[index] &&
			this.currentOptions[index].callback
		) {
			this.currentOptions[index].callback()

			// Emitir evento de opción seleccionada
			this.eventSystem.emit('optionSelected', {
				npc: this,
				option: this.currentOptions[index],
			})
		}

		// Continuar el diálogo si hay más mensajes después de la opción
		this.currentOptions = null
		this.currentDialogIndex++
		if (this.currentDialogIndex < this.dialogs.length) {
			this.currentMessage = this.dialogs[this.currentDialogIndex]
			this.waitingForInput = true
		} else {
			this.endInteraction()
		}
	}

	advanceDialogue() {
		if (this.waitingForInput) {
			// Si el diálogo actual tiene opciones, no avanzamos automáticamente
			const dialog = this.dialogs[this.currentDialogIndex]
			// Si el diálogo actual tiene opciones, esperamos la elección del usuario
			if (typeof dialog === 'object' && dialog.options) {
				this.waitingForInput = false
				this.currentOptions = dialog.options
				return
			}

			// Si no hay opciones, avanzamos al siguiente mensaje
			this.currentDialogIndex++
			this.waitingForInput = false

			if (this.currentDialogIndex < this.dialogs.length) {
				this.currentMessage = this.dialogs[this.currentDialogIndex]
				this.waitingForInput = true
			} else {
				this.endInteraction()
			}
		}
	}

	endInteraction() {
		this.isInteracting = false
		this.currentDialogIndex = 0
		this.waitingForInput = false
		this.currentOptions = null
		this.currentMessage = null
		console.log('Diálogo finalizado')

		// Emitir evento de fin de interacción
		this.eventSystem.emit('interactionEnded', { npc: this })
	}
}
