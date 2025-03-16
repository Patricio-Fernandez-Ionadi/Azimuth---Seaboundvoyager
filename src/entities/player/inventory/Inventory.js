import { Slot } from './Slot.js'

export class Inventory {
	constructor(player) {
		this.player = player
		this.x = 450
		this.y = 5
		this.rows = 16
		this.cols = 12
		this.slotSize = 26
		// this.selectedSlot = null // Slot sel	eccionado actualmente
		this.hoveredSlot = null // Slot sobre el que está el mouse
		this.isOpen = false

		this.draggedItem = null // Ítem arrastrado
		this.draggedFromSlot = null // Slot desde donde se arrastró el ítem
		this.draggedQuantity = 0 // Cantidad arrastrada

		this.init()
	}

	draw(ctx) {
		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.cols; col++) {
				this.slots[row][col].draw(ctx)
			}
		}

		// Dibujar tooltip si hay un slot con hover
		if (this.hoveredSlot && this.hoveredSlot.item) {
			this.drawTooltip(ctx, this.hoveredSlot.item)
		}

		// Dibujar el ítem arrastrado si existe
		if (this.draggedItem) {
			const { mouseX, mouseY } = this.player.game.input
			this.draggedItem.draw(ctx, mouseX - 13, mouseY - 13, this.slotSize)
		}
	}

	addItem(item, quantity = 1) {
		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.cols; col++) {
				const slot = this.slots[row][col]
				if (!slot.item || slot.item.id === item.id) {
					slot.addItem(item, quantity)
					return true
				}
			}
		}
		console.warn('Inventario lleno')
		return false
	}

	drawTooltip(ctx, item) {
		const padding = 10
		const margin = 20
		const textSpacing = 20
		const x = this.hoveredSlot.x + this.slotSize + margin
		const y = this.hoveredSlot.y

		// Fondo del tooltip
		ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
		ctx.fillRect(x, y, 200, 60)

		// Texto del tooltip
		ctx.fillStyle = 'white'
		ctx.font = '14px Arial'
		ctx.fillText(item.name, x + padding, y + padding + 15)
		ctx.fillText(item.description, x + padding, y + padding + 15 + textSpacing)
	}

	init() {
		// Crear la cuadrícula de slots
		this.slots = []
		for (let row = 0; row < this.rows; row++) {
			this.slots[row] = []
			for (let col = 0; col < this.cols; col++) {
				const x = this.x + col * this.slotSize
				const y = this.y + row * this.slotSize
				this.slots[row][col] = new Slot(x, y, this.slotSize - 1)
			}
		}
	}

	/* Events */
	handleClick(mouseX, mouseY) {
		// for (let row = 0; row < this.rows; row++) {
		// 	for (let col = 0; col < this.cols; col++) {
		// 		const slot = this.slots[row][col]
		// 		if (slot.handleClick(mouseX, mouseY)) {
		// 			if (this.selectedSlot) {
		// 				// Mover el ítem al nuevo slot
		// 				const tempItem = this.selectedSlot.item
		// 				const tempQuantity = this.selectedSlot.quantity
		// 				this.selectedSlot.removeItem(tempQuantity)
		// 				slot.addItem(tempItem, tempQuantity)
		// 				this.selectedSlot = null
		// 			} else {
		// 				// Seleccionar el slot
		// 				this.selectedSlot = slot
		// 			}
		// 			return
		// 		}
		// 	}
		// }
	}

	mouseDown(mouseX, mouseY) {
		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.cols; col++) {
				const slot = this.slots[row][col]
				if (slot.handleClick(mouseX, mouseY)) {
					if (slot.item) {
						// Guardar el ítem arrastrado
						this.draggedItem = slot.item
						this.draggedFromSlot = slot
						this.draggedQuantity = slot.quantity // Guardar la cantidad arrastrada
						slot.removeItem(slot.quantity) // Quitar el ítem del slot
					}
					return
				}
			}
		}
	}

	mouseMove(mouseX, mouseY, e) {
		let hovered = false
		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.cols; col++) {
				const slot = this.slots[row][col]
				if (slot.mouseMove(mouseX, mouseY)) {
					this.hoveredSlot = slot
					hovered = true
				}
			}
		}
		if (!hovered) this.hoveredSlot = null
	}

	mouseUp(mouseX, mouseY) {
		if (this.draggedItem) {
			let placed = false // Inicializamos la variable
			for (let row = 0; row < this.rows; row++) {
				for (let col = 0; col < this.cols; col++) {
					const slot = this.slots[row][col]
					if (slot.handleClick(mouseX, mouseY)) {
						// Intentar colocar el ítem en el slot
						if (!slot.item || slot.item.id === this.draggedItem.id) {
							slot.addItem(this.draggedItem, this.draggedQuantity)
							placed = true
							// this.draggedItem = null
							// this.draggedFromSlot = null
							// return
							break
						}
					}
				}
			}
			if (!placed) {
				// Si no se colocó en ningún slot, devolverlo al original
				if (this.draggedFromSlot) {
					this.draggedFromSlot.addItem(this.draggedItem, this.draggedQuantity)
				}

				console.log(mouseX, mouseY)
				// en este punto tenemos en que coordenadas intenta soltarse el item. se ejecuta cuando se esta draggeando un item y se suelta sin haber sido colocado en un espacio habilitado

				//  si this.x < mouseX -> se esta dropeando fuera del inventario
				// soltar item
			}

			// Limpiar el estado de drag and drop
			this.draggedItem = null
			this.draggedFromSlot = null
			this.draggedQuantity = 0
		}
	}
}
