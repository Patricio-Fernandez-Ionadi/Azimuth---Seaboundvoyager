import { loadImage } from '../../core/utils.js'

export class Item {
	constructor(itemData) {
		Object.keys(itemData).forEach((val) => {
			this[val] = itemData[val]
		})

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
