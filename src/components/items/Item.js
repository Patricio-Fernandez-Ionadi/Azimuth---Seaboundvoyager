import { loadImage } from '../../core/utils.js'

export class Item {
	constructor(itemData) {
		this.id = itemData.id || Date.now()
		this.name = itemData.name
		this.description = itemData.description
		this.categories = itemData.categories
		this.variant = itemData.variant
		this.src = itemData.src
		this.stackeable = itemData.stackeable
		this.price = itemData.price
		this.stats = itemData.stats
		this.durability = itemData.durability
		this.quality = itemData.quality
		this.maxStack = itemData.maxStack

		this.loaded = false
		loadImage(this.src).then((res) => {
			this.image = res
			this.loaded = true
		})
	}

	draw(ctx, x, y, size) {
		if (!this.loaded) return
		ctx.drawImage(this.image, x, y, size, size)
	}
}
