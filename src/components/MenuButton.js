import { Button } from './Button.js'

export class MenuButton {
	constructor(idx, lb) {
		this.x = 440
		this.fz = 24
		this.width = 300
		this.height = 50
		this.startY = 50
		this.padding = [20, 35]
		this.label = lb || ''
		this.index = idx || 0

		this.button = new Button(
			this.x,
			this.index > 1 ? this.startY * this.index + 20 : this.startY * this.index,
			this.width,
			this.height,
			this.label,
			this.fz,
			this.padding[0],
			this.padding[1]
		)
	}

	draw(ctx) {
		this.button.draw(ctx)
	}

	mouseMove(mouseX, mouseY) {
		this.button.handleHover(mouseX, mouseY)
	}

	onEvent(cb) {
		this.button.onClick = () => cb()
	}

	handleClick(mouseX, mouseY, e) {
		this.button.handleClick(mouseX, mouseY, e)
	}
}
