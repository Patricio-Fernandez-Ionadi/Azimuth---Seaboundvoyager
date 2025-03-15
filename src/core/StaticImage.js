export class StaticImage {
	constructor(imgUrl) {
		this.x = 0
		this.y = 0
		this.loaded = false
		this.image = new Image()
		this.image.src = imgUrl
		this.image.onload = () => {
			this.loaded = true
			this.width = this.image.width
			this.height = this.image.height
			this.crop = {
				x: 0,
				y: 0,
				width: this.width,
				height: this.height,
			}
		}
	}

	draw(ctx, camera) {
		if (!this.loaded) return
		ctx.drawImage(
			this.image,
			this.crop.x,
			this.crop.y,
			this.crop.width,
			this.crop.height,
			camera.x || this.x,
			camera.y || this.y,
			this.width,
			this.height
		)
	}
}
