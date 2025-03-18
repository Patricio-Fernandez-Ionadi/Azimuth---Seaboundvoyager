import { loadImage } from '../../core/utils.js'

const BG_IMG = '/src/components/inventory/assets/slot.png'
const BG_HOVER_IMG = '/src/components/inventory/assets/slot_hovered.png'

export class Slot {
	constructor(x, y, size) {
		this.x = x
		this.y = y
		this.width = size
		this.height = size
		this.item = null // Ítem almacenado en este slot
		this.quantity = 0 // Cantidad del ítem
		this.isHovered = false // Estado de hover

		this.loaded = {}
		loadImage(BG_IMG).then((res) => {
			this.bg = res
			this.loaded.bg = true
		})
		loadImage(BG_HOVER_IMG).then((res) => {
			this.bg_hover = res
			this.loaded.bg_hover = true
		})
	}

	draw(ctx) {
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

		if (this.item) {
			if (this.item.draw) {
				this.item.draw(ctx, this.x + 5, this.y + 5, this.width - 10)

				// Mostrar la cantidad del ítem
				ctx.fillStyle = 'lightgreen'
				ctx.font = '14px Arial'
				ctx.fillText(this.quantity, this.x + 5, this.y + this.height - 5)
			}
		}
	}
	/* ###### Events ###### */
	mouseMove(mouseX, mouseY, e) {
		this.isHovered =
			mouseX >= this.x &&
			mouseX <= this.x + this.width &&
			mouseY >= this.y &&
			mouseY <= this.y + this.height
		return this.isHovered
	}
	handleClick(mouseX, mouseY) {
		return (
			mouseX >= this.x &&
			mouseX <= this.x + this.width &&
			mouseY >= this.y &&
			mouseY <= this.y + this.height
		)
	}
	/* #################### */

	addItem(item, quantity = 1) {
		if (!this.item) {
			this.item = item
			this.quantity = quantity
		} else if (this.item.id === item.id && this.item.stackeable) {
			this.quantity += quantity
		} else {
			console.warn('El slot ya contiene un ítem diferente')
		}
	}

	removeItem(quantity = 1) {
		if (this.item && this.quantity >= quantity) {
			this.quantity -= quantity
			if (this.quantity <= 0) {
				this.item = null
				this.quantity = 0
			}
		} else {
			console.warn('No hay suficiente cantidad para eliminar')
		}
	}
}
