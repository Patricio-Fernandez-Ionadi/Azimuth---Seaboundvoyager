import { ITEMS_DATA } from './items_data.js'
import { Item } from './Item.js'

export class ItemsManager {
	constructor(game) {
		this.game = game
		this.init()
	}
	init() {
		this.gameItemsData = []
		this.commons = []
		this.innerId = 1
		ITEMS_DATA.forEach((i) => {
			Object.keys(i.variant).forEach((v) => {
				const newItem = new Item({
					...i,
					id: this.innerId,
					price: i.variant[v].price || null,
					stats: i.variant[v].stats || null,
					durability: i.variant[v].durability || null,
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
	getItemsByIncludedCategories(categories, items) {
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
	getFilteredItems(categories, exclude, items = null) {
		// Obtener ítems que coincidan con las categorías incluidas
		const itemsMatchingCategories = this.getItemsByIncludedCategories(
			categories,
			items
		)

		// Excluir ítems que pertenezcan a las categorías excluidas
		const filteredItems = this.excludeItemsByCategories(
			exclude,
			itemsMatchingCategories
		)

		// Devolver el array final
		return filteredItems
	}

	getByCategory(category, exclude = [], items) {
		if (items) {
			if (Array.isArray(category)) {
				return items.filter((item) => {
					const matchesInclude = category.some((cat) =>
						item.categories.includes(cat)
					)
					const matchesExclude = exclude.every(
						(cat) => !item.categories.includes(cat)
					)
					return matchesInclude && matchesExclude
				})
			}

			if (typeof category === 'string') {
				return items.filter(
					(item) =>
						item.categories.includes(category) &&
						!exclude.every((cat) => item.categories.includes(cat))
				)
			}

			console.warn('Categoría inválida en array de items:', category)
			return []
		} else {
			if (Array.isArray(category)) {
				return this.gameItemsData.filter((item) => {
					const matchesInclude = category.some((cat) =>
						item.categories.includes(cat)
					)
					const matchesExclude = exclude.every(
						(cat) => !item.categories.includes(cat)
					)
					return matchesInclude && matchesExclude
				})
			}

			if (typeof category === 'string') {
				return this.gameItemsData.filter(
					(item) =>
						item.categories.includes(category) &&
						!exclude.every((cat) => item.categories.includes(cat))
				)
			}

			console.warn('Categoría inválida en el juego:', category)
			return []
		}
	}

	getByQuality(qualities, probabilities = {}) {
		if (Array.isArray(qualities)) {
			const filteredItems = this.gameItemsData.filter((item) =>
				qualities.includes(item.quality)
			)

			// Aplicar probabilidades si se proporcionan
			if (Object.keys(probabilities).length > 0) {
				return filteredItems.filter((item) => {
					const chance = probabilities[item.quality] || 0
					return Math.random() < chance
				})
			}

			return filteredItems
		}

		if (typeof quality === 'string') {
			return this.gameItemsData.filter((item) => item.quality === quality)
		}

		console.warn('Calidad inválida:', quality)
		return []
	}

	getRandomItem(config) {
		const { categories, exclusions, qualities, probabilities } = config

		const allQualities = ['common', 'rare', 'excellent'] // Calidades disponibles
		let qualitiesToFilter = allQualities
		if (qualities.length > 0) {
			qualitiesToFilter = qualities // uso de qualities especificas
		}
		// Obtener objetos del juego con calidades especificadas
		let filteredItems = this.getByQuality(qualitiesToFilter, probabilities)

		// filtrar categorias y exclusiones
		filteredItems = this.getFilteredItems(categories, exclusions, filteredItems)

		// Seleccionar ítem aleatorio
		const result = []
		const randomIndex = Math.floor(Math.random() * filteredItems.length)

		// Crear una nueva instancia del ítem
		const newItem = new Item(filteredItems[randomIndex])
		result.push(newItem)

		// filteredItems.splice(randomIndex, 1) // Evitar duplicados

		return result
	}

	getRandomItems(count, options = {}) {
		const { categories, exclusions, qualities, probabilities } = options

		const allQualities = ['common', 'rare', 'excellent'] // Calidades disponibles
		let qualitiesToFilter = allQualities
		if (qualities.length > 0) {
			qualitiesToFilter = qualities // uso de qualities especificas
		}

		let filteredItems = this.getByQuality(qualitiesToFilter, probabilities)

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
