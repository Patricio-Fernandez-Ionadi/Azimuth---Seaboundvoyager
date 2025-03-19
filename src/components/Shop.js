import { Inventory } from './inventory/Inventory.js'
import { Item } from './items/Item.js'

export class Shop {
	constructor(owner, shopConfig) {
		this.owner = owner
		this.conf = shopConfig
		this.categories = this.conf.categories || []
		this.restockTimes = this.conf.restockTimes || [8, 17]
		this.exclusions = this.conf.exclusions || []
		this.qualities = this.conf.qualities || []
		this.maxItems = this.conf.randomItems?.maxItems || 12
		this.inventory = new Inventory(this.owner, 10, 50)
		this.lastRestock = null
		this.initializeInventory()
	}

	initializeInventory() {
		let slotsOccupied = 0

		// Agregar ítems predeterminados
		this.conf.defaultItems?.forEach((defaultItem) => {
			const itemData = this.owner.game.itemsManager.getItem(defaultItem.id)
			if (itemData) {
				itemData.isFixed = defaultItem.isFixed
				this.inventory.addItem(itemData, defaultItem.quantity, this.owner)
				slotsOccupied += 1
			}
		})

		while (slotsOccupied < this.maxItems) {
			// 	// Obtener un ítem aleatorio
			const item = this.owner.game.itemsManager.getRandomItem({
				categories: this.categories,
				qualities: this.qualities,
				probabilities: { common: 0.7, rare: 0.3 },
				exclusions: this.exclusions,
			})

			if (item && item.price.buy) {
				// 		// Aplicar probabilidades?
				// 		// console.log(item)

				const quantity = item.stackeable
					? Math.floor(Math.random() * 20) + 1
					: 1

				const { newSlot } = this.inventory.addItem(item, quantity, this.owner)
				if (newSlot) slotsOccupied += 1

				if (this.conf.itemRules?.limitedItems?.includes(item.id)) {
					item.isLimited = true
				} // Verificar si el ítem es limitado
			}
		}
		// Ordenar ítems
		// this.sortInventory()
	}

	sortInventory() {
		// Aplanar la cuadrícula de slots en un array plano
		const flatSlots = this.inventory.slots.flat()

		// Filtrar solo los slots que tienen ítems
		const filledSlots = flatSlots.filter((slot) => slot.item)

		// Ordenar los slots por categoría y precio
		filledSlots.sort((a, b) => {
			const categoryA = a.item.categories[0] || ''
			const categoryB = b.item.categories[0] || ''
			if (categoryA !== categoryB) {
				return categoryA.localeCompare(categoryB)
			}
			return a.item.price.buy - b.item.price.buy
		})
		// Reorganizar los slots en la cuadrícula original
		let index = 0
		for (let row of this.inventory.slots) {
			for (let slot of row) {
				if (filledSlots[index]) {
					slot.item = filledSlots[index].item
					slot.quantity = filledSlots[index].quantity
					index++
				} else {
					slot.item = null
					slot.quantity = 0
				}
			}
		}
	}

	buyItem(slot) {
		const item = slot.item
		if (!item) return
		const price = item.price.buy
		const player = this.owner.game.player
		let isFixedItem = false

		this.conf.defaultItems?.forEach((di) => {
			if (di.id === item.id && di.isFixed) {
				isFixedItem = true
			}
		})

		if (player.resources.gold >= price) {
			player.resources.gold -= price
			const bougthItem = new Item({ ...item, isFixed: false })
			player.inventory.addItem(bougthItem, 1, player)

			// Verificar si el ítem es fijo o limitado
			if (!item.isFixed) {
				slot.removeItem(1) // Reducir cantidad
				if (slot.quantity <= 0 && !isFixedItem) slot.item = null
			}
			console.log(`Comprado: ${item.name}`)
		} else {
			console.warn('No tienes suficiente oro para comprar este ítem')
		}
	}

	checkRestock(currentHour) {
		// Redondear la hora actual para evitar problemas de precisión decimal
		const gameHour = Math.floor(currentHour)

		// Verificar si es hora de restablecer el inventario y si no se ha hecho ya en esta hora
		if (this.restockTimes.includes(gameHour) && this.lastRestock !== gameHour) {
			// Limpiar el inventario actual
			this.inventory.slots.forEach((row) => {
				row.forEach((slot) => {
					if (slot.item) {
						slot.removeItem(slot.quantity) // Limpiar solo si hay un ítem
					}
				})
			})

			// Generar un nuevo inventario
			this.initializeInventory()

			// Actualizar la última hora de restock
			this.lastRestock = gameHour

			// console.log('Inventario de la tienda restablecido', this)
		}
	}
}
