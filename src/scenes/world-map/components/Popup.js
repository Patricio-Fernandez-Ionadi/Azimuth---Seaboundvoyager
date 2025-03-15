import { Button } from '../../../components/Button.js'

export class Popup {
	constructor(x, y, width, height, title, content, priority = 1, game) {
		this.id = Date.now()
		this.x = x
		this.y = y
		this.width = width
		this.height = height
		this.title = title
		this.content = content
		this.buttons = []
		this.isOpen = true
		this.priority = priority
		this.game = game
		this.background = new Image()
		this.background.src = '/src/scenes/world-map/assets/Switch_0.png'
	}

	addButton(label, action) {
		const buttonX = this.x + 30
		const buttonY = this.y + 170 + this.buttons.length * 40 // Posición vertical dinámica
		const buttonWidth = this.width - 60
		const buttonHeight = 35

		const button = new Button(
			buttonX,
			buttonY,
			buttonWidth,
			buttonHeight,
			label,
			16, // font size
			10, // padding label X
			22 // padding label Y
		)
		button.onClick = action // Asignar la acción al botón
		this.buttons.push(button)
	}

	draw(ctx) {
		if (!this.isOpen) return
		// console.log(this.content)

		ctx.save()
		ctx.drawImage(
			this.background,
			5,
			5,
			this.background.width - 10,
			this.background.height - 10,
			this.x,
			this.y,
			this.width,
			this.height
		)

		// text
		ctx.fillStyle = 'white'
		ctx.font = '20px Arial'
		ctx.fillText(this.title, this.x + 50, this.y + 50)
		ctx.font = '16px Arial'
		ctx.fillText(this.content.name, this.x + 25, this.y + 80)

		this.content.properties.forEach((prop, idx) => {
			if (prop.name !== 'tipo') {
				ctx.font = '14px Arial'
				ctx.fillText(prop.name, this.x + 25, this.y + 110 + idx * 20)
				ctx.fillText(`= ${prop.value}`, this.x + 100, this.y + 110 + idx * 20)
			}
		})

		// botones
		this.buttons.forEach((button) => button.draw(ctx))
		ctx.restore()
	}

	isPointInside(x, y) {
		return (
			x >= this.x &&
			x <= this.x + this.width &&
			y >= this.y &&
			y <= this.y + this.height
		)
	}

	handleClick(mouseX, mouseY, e) {
		if (!this.isOpen) return false

		// Delegar el manejo de clics a los botones
		for (const button of this.buttons) {
			if (button.isPointInside(mouseX, mouseY)) {
				button.handleClick(mouseX, mouseY, e)
				return true
			}
		}
		return false
	}

	mouseMove(mouseX, mouseY, e) {
		if (!this.isOpen) return false

		let hovered = false

		for (const button of this.buttons) {
			if (button.isPointInside(mouseX, mouseY)) {
				button.handleHover(mouseX, mouseY)
				hovered = true
			} else {
				button.handleHover(null, null) // Desactivar hover si el mouse no está encima
			}
		}
		return hovered
	}

	close() {
		this.isOpen = false
	}
}
