import { loadImage } from '../core/utils.js'

const BG_IMG = '/src/components/assets/Bar_0.png'
const BG_HOVER_IMG = '/src/components/assets/Bar_1.png'
export class Button {
	constructor(x, y, width, height, label, fz = 24, lx = 0, ly = 0) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height
		this.label = label
		this.labelX = lx
		this.labelY = ly
		this.fontSize = fz
		this.isHovered = false

		this.loaded = {}
		loadImage(BG_IMG).then((res) => {
			this.bg = res
			this.loaded = { ...this.loaded, bg: true }
		})
		loadImage(BG_HOVER_IMG).then((res) => {
			this.bg_hover = res
			this.loaded = { ...this.loaded, bg_hover: true }
		})
	}

	isPointInside(mouseX, mouseY) {
		return (
			mouseX >= this.x &&
			mouseX <= this.x + this.width &&
			mouseY >= this.y &&
			mouseY <= this.y + this.height
		)
	}

	handleHover(mouseX, mouseY) {
		this.isHovered = this.isPointInside(mouseX, mouseY)
	}

	handleClick(mouseX, mouseY, e) {
		if (
			this.isPointInside(mouseX, mouseY) &&
			typeof this.onClick === 'function'
		) {
			this.onClick(e)
			return true
		}
		return false
	}

	draw(ctx) {
		if (!this.loaded.bg && !this.loaded.bg_hover) return

		ctx.save()
		const img = this.isHovered ? this.bg_hover : this.bg

		ctx.drawImage(
			img,
			0,
			0,
			img.width,
			img.height,
			this.x,
			this.y,
			this.width,
			this.height
		)

		// Dibujar el texto del botón
		ctx.fillStyle = this.isHovered ? 'white' : '#aaa'
		ctx.font = `${this.fontSize}px Arial`
		ctx.fillText(this.label, this.x + this.labelX, this.y + this.labelY)
		ctx.restore()
	}
}
