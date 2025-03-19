import { Inventory } from './inventory/Inventory.js'

export class Shop {
	constructor(
		owner,
		categories,
		restockTimes = [8, 17],
		exclusions = [],
		qualities = []
	) {
		this.owner = owner
		this.categories = categories
		this.restockTimes = restockTimes // Horarios de reposición
		this.exclusions = exclusions
		this.qualities = qualities
		this.inventory = new Inventory(this.owner, 10, 50)
		this.lastRestock = null
		this.initializeInventory()
	}

	initializeInventory() {
		const maxItems = 12
		let slotsOccupied = 0

		while (slotsOccupied < maxItems) {
			// Obtener un ítem aleatorio
			const item = this.owner.game.itemsManager.getRandomItem({
				categories: this.categories,
				qualities: this.qualities,
				probabilities: { common: 0.7, rare: 0.3 },
				exclusions: this.exclusions,
			})

			if (item && item.price.buy > 0) {
				// Aplicar probabilidades?
				// console.log(item)

				const quantity = item.stackeable
					? Math.floor(Math.random() * 20) + 1
					: 1

				const { newSlot } = this.inventory.addItem(item, quantity)
				if (newSlot) slotsOccupied += 1
			}
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
