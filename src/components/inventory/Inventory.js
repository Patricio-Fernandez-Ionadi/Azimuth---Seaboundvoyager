import { Player } from '../../entities/player/player.js'
import { Slot } from './Slot.js'

export class Inventory {
	constructor(owner, x, y, isNPC = true) {
		this.owner = owner
		this.x = x
		this.y = y
		this.rows = 16
		this.cols = 12
		this.slotSize = 26
		this.hoveredSlot = null // Slot en hover
		this.isOpen = false
		this.width = this.rows * this.slotSize
		this.height = this.cols * this.slotSize

		this.draggedFromSlot = null // Slot de partida
		this.draggedItem = null // Ítem arrastrado
		this.draggedQuantity = 0 // Cantidad arrastrada

		this.tradeMode = false
		this.isNPC = isNPC

		if (this.owner.game) {
			this.owner.game.eventSystem.on('playerTradeWindowOpen', () => {
				this.tradeMode = true
			})
			this.owner.game.eventSystem.on('tradeWindowClosed', () => {
				this.tradeMode = false
			})
		}

		this.#createGrid()
	}

	draw(ctx) {
		this.renderSlots(ctx)
	}

	/* ###### Events ###### */
	mouseDown(mouseX, mouseY) {
		// if (this.tradeMode) {
		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.cols; col++) {
				const slot = this.slots[row][col]
				if (slot.handleClick(mouseX, mouseY)) {
					if (this.isNPC && slot.item) {
						// Si es un inventario de NPC, intentar comprar el ítem
						this.buyItem(slot)
					} else {
						// Si es un inventario normal, iniciar el arrastre
						this.pickItem(mouseX, mouseY)
					}
					return true
				}
			}
		}
		return false
		// }
	}
	mouseMove(mouseX, mouseY, e) {
		if (!this.isOpen) return
		this.hoverSlot(mouseX, mouseY)
	}
	mouseUp(mouseX, mouseY) {
		if (this.draggedItem) this.dropItem(mouseX, mouseY)
	}
	/* #################### */
	/* Load */
	#createGrid() {
		// Crear la cuadrícula de slots
		this.slots = []
		for (let row = 0; row < this.rows; row++) {
			this.slots[row] = []
			for (let col = 0; col < this.cols; col++) {
				const x = this.x + col * this.slotSize
				const y = this.y + row * this.slotSize
				this.slots[row][col] = new Slot(x, y, this.slotSize)
			}
		}
	}

	/* Render */
	renderSlots(ctx) {
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
			const { mouseX, mouseY } = this.owner.game.input
			this.draggedItem.draw(ctx, mouseX - 13, mouseY - 13, this.slotSize)
		}
	}
	drawTooltip(ctx, item) {
		const padding = 10
		const margin = 20
		const textSpacing = 20
		const x = this.hoveredSlot.x + this.slotSize + margin
		const y = this.hoveredSlot.y

		// Fondo del tooltip
		ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
		ctx.fillRect(x, y, 200, 75)

		// Texto del tooltip
		ctx.fillStyle = 'white'
		ctx.font = '14px Arial'
		ctx.fillText(item.name, x + padding, y + padding + 15)
		ctx.fillText(item.description, x + padding, y + padding + 15 + textSpacing)
		ctx.fillText(
			'Precio de venta: $' + item.price,
			x + padding,
			y + padding + 35 + textSpacing
		)
	}

	buyItem(slot) {
		const item = slot.item
		const price = item.price

		const player = this.owner.game.player
		// if (!player || !player.resources) {
		// 	console.warn('No se puede comprar: Jugador no válido')
		// 	return
		// }

		if (player.resources.gold >= price) {
			player.resources.gold -= price
			player.inventory.addItem(item, 1) // Añadir el ítem al inventario del jugador
			slot.removeItem(1) // Eliminar una unidad del inventario del NPC
			console.log(`Comprado: ${item.name}`)
		} else {
			console.warn('No tienes suficiente oro para comprar este ítem')
		}
	}
	addItem(item, quantity = 1) {
		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.cols; col++) {
				const slot = this.slots[row][col]
				if (!slot.item || slot.item.id === item.id) {
					// Stackear el ítem si es del mismo tipo
					slot.addItem(item, quantity)
					return true
				}
			}
		}

		// Si no se puede stackear, buscar el primer slot vacío
		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.cols; col++) {
				const slot = this.slots[row][col]
				if (!slot.item) {
					slot.addItem(item, quantity)
					return true
				}
			}
		}

		console.warn('Inventario lleno')
		return false
	}
	dropItem(mouseX, mouseY) {
		let placed = false

		// Intentar colocar el ítem en un slot válido
		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.cols; col++) {
				const slot = this.slots[row][col]
				if (slot.handleClick(mouseX, mouseY)) {
					// Intentar colocar el ítem en el slot
					if (!slot.item || slot.item.id === this.draggedItem.id) {
						slot.addItem(this.draggedItem, this.draggedQuantity)
						placed = true
						break
					}
				}
			}
		}
		if (!placed) {
			if (this.tradeMode) {
				// En modo de comercio, intentar vender el ítem
				if (this.owner instanceof Player && this.draggedItem?.price) {
					const sellPrice = this.draggedItem.price * this.draggedQuantity
					this.owner.resources.gold += sellPrice
					console.log(
						`Vendido: ${this.draggedItem.name} x${this.draggedQuantity}`
					)
				} else {
					console.warn('El ítem no tiene precio o no se puede vender')
				}
			} else {
				console.log(this.x)
				console.log(mouseX)
				// Fuera del modo de comercio, verificar si el ítem se eliminó
				if (this.x > mouseX) {
					console.log('Ítem eliminado: se soltó fuera del inventario')
					// No devolver el ítem al slot original ni hacer nada más
				} else {
					// Si no se soltó fuera, devolverlo al slot original
					if (this.draggedFromSlot) {
						this.draggedFromSlot.addItem(this.draggedItem, this.draggedQuantity)
					}
				}
			}
		}
		// Limpiar el estado de drag and drop
		this.draggedItem = null
		this.draggedFromSlot = null
		this.draggedQuantity = 0
	}
	pickItem(mouseX, mouseY) {
		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.cols; col++) {
				const slot = this.slots[row][col]
				if (slot.handleClick(mouseX, mouseY)) {
					if (slot.item) {
						// Guardar el ítem arrastrado
						this.draggedItem = slot.item // item del slot
						this.draggedFromSlot = slot // desde que slot se interactua
						this.draggedQuantity = slot.quantity // Guardar la cantidad
						slot.removeItem(slot.quantity) // Quitar el ítem del slot
					}
					return
				}
			}
		}
	}
	hoverSlot(mouseX, mouseY) {
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
}
