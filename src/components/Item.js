import { loadImage } from '../core/utils.js'

export class Item {
	constructor(id, name, description, imageSrc, price) {
		this.id = id
		this.name = name
		this.description = description
		this.maxStack = 99
		this.price = price

		this.loaded = false
		loadImage(imageSrc).then((res) => {
			this.image = res
			this.loaded = true
		})
	}

	draw(ctx, x, y, size) {
		if (!this.loaded) return
		ctx.drawImage(this.image, x, y, size, size)
	}
}
