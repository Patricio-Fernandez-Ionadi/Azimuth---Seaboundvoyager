import { Player } from '../../entities/player.js'
import { Text } from '../Text.js'
import { Slot } from './Slot.js'

export class Inventory {
	constructor(owner, x, y, isNPC = true, rows, cols) {
		this.owner = owner
		this.game = this.owner.game
		this.x = x
		this.y = y
		this.rows = rows || 8
		this.cols = cols || 8
		this.slotSize = 40
		this.hoveredSlot = null // Slot en hover
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

	draw() {
		const { ctx } = this.game
		this.renderSlots(ctx)
		this.renderItemDragging(ctx)
	}

	/* ###### Events ###### */
	mouseDown(mouseX, mouseY, e) {
		this.handleItemActionOnClick(mouseX, mouseY)
	}
	mouseMove(mouseX, mouseY, e) {
		this.hoverSlot(mouseX, mouseY)
	}
	mouseUp(mouseX, mouseY, e) {
		if (this.draggedItem) this.dropPickedItem(mouseX, mouseY)
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
	setGrid(rows, cols) {
		this.rows = rows
		this.cols = cols

		// Si no hay slots creados, crear una nueva cuadrícula
		if (!this.slots || this.slots.length === 0) {
			this.#createGrid(rows, cols)
			return
		}

		// Reposicionar los slots existentes
		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < cols; col++) {
				const slot = this.slots[row]?.[col]
				if (slot) {
					slot.x = this.x + col * this.slotSize
					slot.y = this.y + row * this.slotSize
					slot.width = this.slotSize
					slot.height = this.slotSize
				}
			}
		}
	}

	// mouse down
	handleItemActionOnClick(mouseX, mouseY) {
		for (let row = 0; row < this.rows; row++) {
			for (let col = 0; col < this.cols; col++) {
				const slot = this.slots[row][col]
				if (slot.handleClick(mouseX, mouseY)) {
					if (this.isNPC && slot.item) {
						// Si es un inventario de NPC, intentar comprar el ítem
						this.owner.shop.buyItem(slot)
					} else {
						// Si es un inventario normal, iniciar el arrastre
						this.dragPickedItem(mouseX, mouseY)
					}
					return true
				}
			}
		}
		return false
	}
	dragPickedItem(mouseX, mouseY) {
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
	// mouse move
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
	// mouse up
	dropPickedItem(mouseX, mouseY) {
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
					const sellPrice = this.draggedItem.price.sell * this.draggedQuantity
					this.owner.resources.gold += sellPrice
					console.log(
						`Vendido: ${this.draggedItem.name} x${this.draggedQuantity}`
					)
				} else {
					console.warn('El ítem no tiene precio o no se puede vender')
				}
			} else {
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

	addItem(item, quantity = 1) {
		for (let row of this.slots) {
			for (let slot of row) {
				let canStack =
					slot.item?.id === item?.id &&
					slot.item?.stackeable &&
					slot.quantity + quantity <= slot.item?.maxStack

				if (!slot.item) {
					// Si el slot está vacío, agregar el ítem
					slot.addItem(item, quantity)
					return { newSlot: true }
				} else if (canStack) {
					// Si el ítem es apilable y cabe en el slot, incrementar la cantidad
					slot.quantity += quantity
					return { newSlot: false }
				}
			}
		}
		console.warn('Inventario lleno: No hay espacio para agregar el ítem.')
		return false
	}

	/* Render */
	renderItemDragging(ctx) {
		// Dibujar el ítem arrastrado si existe
		if (this.draggedItem) {
			const { x: mouseX, y: mouseY } = this.owner.game.customCursor.position
			this.draggedItem.draw(ctx, mouseX - 13, mouseY - 13, this.slotSize)
		}
	}

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
	}
	drawTooltip(ctx, item) {
		const width = 200
		let height = 30
		const padding = 10
		const margin = 20
		const size = 20
		const lineHeight = 18
		const tooltipX = this.hoveredSlot.x /* + this.slotSize + margin */
		const tooltipY = this.hoveredSlot.y + this.slotSize + margin
		const x = tooltipX + padding
		const y = tooltipY + padding

		const price =
			this.owner instanceof Player ? item.price.sell : item.price.buy
		const quality = item.quality

		const info = [
			{ label: item.name, y: y + lineHeight },
			{ label: item.description, y: y + lineHeight * 2 },
			{
				label: 'Precio de venta: $' + price,
				y: y + lineHeight * 3,
			},
			{
				label: quality,
				color:
					quality === 'excellent'
						? 'lightgreen'
						: quality === 'rare'
						? 'violet'
						: 'white',
				y: y + lineHeight * 4,
			},
		]

		if (item.categories.includes('contraband')) {
			info.push({
				label: 'Objeto ilegal.',
				y: y + lineHeight * 5,
				color: 'red',
			})
		}
		// podriamos ver si el item tiene stats tambien para mostrar

		height = padding * 2 + lineHeight * info.length

		// Fondo del tooltip
		ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
		ctx.fillRect(tooltipX, tooltipY, width, height)

		info.forEach((e) => Text({ x, size, ctx, ...e }))
	}
}
