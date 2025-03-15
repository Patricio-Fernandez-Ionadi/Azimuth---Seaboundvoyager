export class Player {
	constructor(x, y, game) {
		this.game = game
		this.x = x
		this.y = y
		this.width = 32
		this.height = 32
		this.color = 'red'
		this.speed = 2 // Velocidad de movimiento
		this.velocity = {
			x: 0,
			y: 0,
		}
	}

	update(keys) {
		if (
			(keys?.['ArrowUp'] || keys?.['w']) &&
			!this.game.sceneManager.activeScene.currentNPCWithOptions
		) {
			this.velocity.y = -this.speed
		} else if (
			(keys?.['ArrowDown'] || keys?.['s']) &&
			!this.game.sceneManager.activeScene.currentNPCWithOptions
		) {
			this.velocity.y = this.speed
		} else {
			this.velocity.y = 0
		}

		if (keys?.['ArrowLeft'] || keys?.['a']) {
			this.velocity.x = -this.speed
		} else if (keys?.['ArrowRight'] || keys?.['d']) {
			this.velocity.x = this.speed
		} else {
			this.velocity.x = 0
		}

		this.y += this.velocity.y
		this.x += this.velocity.x
	}

	draw(ctx, camera) {
		ctx.fillStyle = this.color
		ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height)
	}
}
