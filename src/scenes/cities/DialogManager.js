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

	startDialogue(npc) {
		this.currentNPC = npc
		this.currentMessageIndex = 0
		this.selectedOptionIndex = 0
		this.advanceDialogue()
	}

	advanceDialogue() {
		if (!this.currentNPC) return

		const dialog = this.currentNPC.dialogs[this.currentMessageIndex]
		if (!dialog) {
			this.endDialogue()
			return
		}

		if (typeof dialog === 'object' && dialog.options) {
			this.currentMessage = dialog.message
			this.currentOptions = dialog.options
		} else {
			this.currentMessage = dialog
			this.currentOptions = null
			this.currentMessageIndex++
		}
	}

	selectOption(index) {
		if (!this.currentNPC || !this.currentOptions) return

		const selectedOption = this.currentOptions[index]
		if (selectedOption?.callback) {
			selectedOption.callback()
		}

		this.currentMessageIndex++
		this.advanceDialogue()
	}

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

	renderDialogBox() {
		if (!this.currentMessage) return
		const { ctx } = this.game

		const padding = 20
		const boxWidth = 400
		const boxHeight = 100
		const x = (this.game.width - boxWidth) / 2
		const y = this.game.height - boxHeight - padding

		// Dibujar el cuadro de diálogo
		ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
		ctx.fillRect(x, y, boxWidth, boxHeight)

		// Dibujar el texto
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

		// Dibujar el cuadro de opciones
		ctx.fillStyle = 'rgba(228, 7, 7, 0.62)'
		ctx.fillRect(x, y, boxWidth, boxHeight)

		// Mostrar cada opción en pantalla
		ctx.save()
		this.currentOptions.forEach((option, index) => {
			ctx.fillStyle = this.selectedOptionIndex === index ? 'yellow' : 'white'
			ctx.font = '16px Arial'
			ctx.fillText(option.text, x + padding, y + padding + 30 * index)
		})
		ctx.restore()
	}
}
