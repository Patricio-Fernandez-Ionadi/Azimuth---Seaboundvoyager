import { ITEMS_DATA } from './items_data.js'
import { Item } from './Item.js'

export class ItemsManager {
	constructor(game) {
		this.game = game
		this.init()
	}
	init() {
		this.gameItemsData = []
		this.innerId = 1
		ITEMS_DATA.forEach((i) => {
			// Validar que el ítem tenga las propiedades necesarias
			if (!i || !i.variant || typeof i.variant !== 'object') {
				console.warn('Ítem inválido, saltando:', i)
				return
			}

			Object.keys(i.variant).forEach((v) => {
				const variant = i.variant[v]
				if (!variant) {
					console.warn(`Variante '${v}' inválida para el ítem:`, i)
					return
				}

				// Generar un ID único basado en el nombre del ítem y su calidad
				const numericalId = this.innerId

				const newItem = new Item({
					...i,
					id: numericalId,
					price: variant.price || null,
					stats: variant.stats || null,
					durability: variant.durability || null,
					quality: v,
				})
				this.innerId++
				this.gameItemsData.push(newItem)
			})
		})
	}

	getItem(id) {
		const itemData = this.gameItemsData.find((item) => item.id === id)
		if (!itemData) {
			console.warn(`Ítem con ID ${id} no encontrado`)
			return null
		}
		// Crear una nueva instancia del ítem
		return new Item(itemData)
	}

	getItemsByIncludedCategories(categories, items = null) {
		if (items) {
			return items.filter((item) =>
				categories.some((cat) => item.categories.includes(cat))
			)
		} else {
			return this.gameItemsData.filter((item) =>
				categories.some((cat) => item.categories.includes(cat))
			)
		}
	}
	excludeItemsByCategories(excludedCategories, items = null) {
		if (items) {
			return items.filter((item) =>
				excludedCategories.every((cat) => !item.categories.includes(cat))
			)
		} else {
			return this.gameItemsData.filter((item) =>
				excludedCategories.every((cat) => !item.categories.includes(cat))
			)
		}
	}
	getFilteredItems(categories, exclusions, items = null) {
		// Obtener ítems que coincidan con las categorías incluidas
		const itemsMatchingCategories = this.getItemsByIncludedCategories(
			categories,
			items
		)

		// Excluir ítems que pertenezcan a las categorías excluidas
		const filteredItems = this.excludeItemsByCategories(
			exclusions,
			itemsMatchingCategories
		)

		// Devolver el array final
		return filteredItems
	}

	getByQuality(qualities, items) {
		const allQualities = ['common', 'rare', 'excellent'] // Calidades disponibles

		let qualitiesToFilter = allQualities

		if (qualities && qualities.length > 0) {
			qualitiesToFilter = qualities // uso de qualities especificas
		}

		if (items) {
			return items.filter((item) => qualitiesToFilter.includes(item.quality))
		} else {
			return this.gameItemsData.filter((item) =>
				qualitiesToFilter.includes(item.quality)
			)
		}

		// // Aplicar probabilidades si se proporcionan
		// if (Object.keys(probabilities).length > 0) {
		// 	return filteredItems.filter((item) => {
		// 		console.log(probabilities[item.quality])
		// 		const chance = probabilities[item.quality] || 0
		// 		return Math.random() < chance
		// 	})
		// }

		// console.warn('Calidad inválida:', quality)
		// return []
	}

	getRandomItem(config) {
		const { categories, exclusions, qualities } = config

		// obtener categorias disponibles
		let filteredItems = this.getFilteredItems(categories, exclusions)

		// filtrado de calidades
		filteredItems = this.getByQuality(qualities, filteredItems)

		// Seleccionar ítem aleatorio
		const randomIndex = Math.floor(Math.random() * filteredItems.length)

		// Crear una nueva instancia del ítem
		const newItem = new Item(filteredItems[randomIndex])

		return newItem
	}
	getRandomItems(count, config) {
		const { categories, exclusions, qualities } = config

		let filteredItems = this.getByQuality(qualities)

		filteredItems = this.getFilteredItems(categories, exclusions, filteredItems)

		// Seleccionar ítems aleatorios
		const result = []
		while (result.length < count && filteredItems.length > 0) {
			const randomIndex = Math.floor(Math.random() * filteredItems.length)

			// Crear una nueva instancia del ítem
			const newItem = new Item(filteredItems[randomIndex])
			result.push(newItem)

			filteredItems.splice(randomIndex, 1) // Evitar duplicados
		}

		return result
	}

	// getRandomVariant(item) {
	// 	let randomIndex = Math.floor(Math.random() * item.variant.quality.length)

	// 	// Probabilidad de generar una variante rara (10%)
	// 	if (Math.random() < 0.1 && item.variant.quality.includes('rare')) {
	// 		randomIndex = item.variant.quality.indexOf('rare')
	// 	}
	// 	return new Item({
	// 		...item,
	// 		variant: {
	// 			quality: item.variant.quality?.[randomIndex],
	// 			price: item.variant.price?.[randomIndex],
	// 			durability: item.variant.durability?.[randomIndex],
	// 			stats: item.variant.stats?.[randomIndex],
	// 		},
	// 	})
	// }
}
