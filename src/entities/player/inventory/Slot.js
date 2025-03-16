import { loadImage } from '../../../core/utils.js'

export class Slot {
	constructor(x, y, size) {
		this.x = x
		this.y = y
		this.width = size
		this.height = size
		this.item = null // Ítem almacenado en este slot
		this.quantity = 0 // Cantidad del ítem
		this.isHovered = false // Estado de hover

		/* Images */
		this.loaded = { bg: false, bg_hover: false }
		loadImage('/src/entities/player/inventory/assets/slot.png').then((res) => {
			this.bgImg = res
			this.loaded.bg = true
		})
		loadImage('/src/entities/player/inventory/assets/slot_hovered.png').then(
			(res) => {
				this.bg_hoverImg = res
				this.loaded.bg_hover = true
			}
		)
	}

	addItem(item, quantity = 1) {
		console.log('add item')
		if (!this.item) {
			this.item = item
			this.quantity = quantity
		} else if (this.item.id === item.id) {
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

	draw(ctx) {
		ctx.drawImage(
			this.isHovered ? this.bg_hoverImg : this.bgImg,
			this.x,
			this.y
		)

		// Dibujar el ítem si existe
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
}
