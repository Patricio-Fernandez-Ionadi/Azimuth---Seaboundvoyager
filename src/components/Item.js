import { loadImage } from '../core/utils.js'

export class Item {
	constructor(id, name, description, imageSrc, maxStack = 99) {
		this.id = id
		this.name = name
		this.description = description
		this.maxStack = maxStack

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
