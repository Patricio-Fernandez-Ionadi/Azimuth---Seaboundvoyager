export class Player {
	constructor(x, y, game) {
		this.game = game
		this.x = x
		this.y = y
		this.width = 32
		this.height = 32
		this.color = 'red'
		this.speed = 3 // Velocidad de movimiento
		this.velocity = {
			x: 0,
			y: 0,
		}
	}

	update(keys) {
		const interactingWithNPC =
			!!this.game.sceneManager.activeScene.dialogManager.currentOptions

		const moveUp = (keys?.['ArrowUp'] || keys?.['w']) && !interactingWithNPC
		const moveBot = (keys?.['ArrowDown'] || keys?.['s']) && !interactingWithNPC

		const moveLeft = (keys?.['ArrowLeft'] || keys?.['a']) && !interactingWithNPC
		const moveRight =
			(keys?.['ArrowRight'] || keys?.['d']) && !interactingWithNPC

		if (moveUp) {
			this.velocity.y = -this.speed
		} else if (moveBot) {
			this.velocity.y = this.speed
		} else {
			this.velocity.y = 0
		}

		if (moveLeft) {
			this.velocity.x = -this.speed
		} else if (moveRight) {
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
