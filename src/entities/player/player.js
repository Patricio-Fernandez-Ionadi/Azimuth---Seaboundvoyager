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

		this.interactionRequired =
			!!this.game.sceneManager?.activeScene?.dialogManager.currentOptions
	}

	update() {
		this.updateInputs()
		this.horizontalMovement()
		this.verticalMovemet()

		this.y += this.velocity.y
		this.x += this.velocity.x
	}

	draw(ctx, camera) {
		ctx.fillStyle = this.color
		ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height)
	}

	horizontalMovement() {
		const moveLeft = this.direction.left && !this.interactionRequired
		const moveRight = this.direction.right && !this.interactionRequired

		if (moveLeft) {
			this.velocity.x = -this.speed
		} else if (moveRight) {
			this.velocity.x = this.speed
		} else {
			this.velocity.x = 0
		}
	}

	verticalMovemet() {
		const moveUp = this.direction.up && !this.interactionRequired
		const moveBot = this.direction.bottom && !this.interactionRequired

		if (moveUp) {
			this.velocity.y = -this.speed
		} else if (moveBot) {
			this.velocity.y = this.speed
		} else {
			this.velocity.y = 0
		}
	}

	updateInputs() {
		this.direction = {
			left: this.game.keys?.['ArrowLeft'] || this.game.keys?.['a'],
			right: this.game.keys?.['ArrowRight'] || this.game.keys?.['d'],
			up: this.game.keys?.['ArrowUp'] || this.game.keys?.['w'],
			bottom: this.game.keys?.['ArrowDown'] || this.game.keys?.['s'],
		}
	}
}
