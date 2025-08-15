export class CollisionBlock {
	constructor({ x, y, width, height }) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height
	}

	draw(c, camera) {
		// Optional: Draw collision blocks for debugging
		c.fillStyle = 'rgba(255, 0, 0, 0.5)'
		c.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height)
	}
}
