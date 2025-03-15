export class WorldMap {
	constructor(game) {
		this.game = game
		this.loaded = false
		this.image = new Image()
		this.image.src = './src/scenes/world-map/assets/world_map_pirates.png'
		this.image.onload = () => {
			this.loaded = true
			this.width = this.image.width
			this.height = this.image.height
		}
	}

	draw(camera) {
		if (!this.loaded) return
		const { ctx } = this.game
		ctx.drawImage(
			this.image,
			0,
			0,
			this.width,
			this.height,
			camera.x,
			camera.y,
			this.width,
			this.height
		)
	}
}
