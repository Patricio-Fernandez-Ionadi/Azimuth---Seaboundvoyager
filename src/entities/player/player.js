export class Player {
	constructor(x, y, game) {
		this.game = game
		this.eventSystem = this.game.eventSystem
		this.x = x
		this.y = y
		this.width = 32
		this.height = 32
		this.color = 'red'

		/* Fisicas */
		this.speed = 3 // Velocidad de movimiento
		this.velocity = {
			x: 0,
			y: 0,
		}
		this.colliding = null

		/* Gameplay */
		this.reputation = {
			pirates: 0,
			merchants: 0,
			explorers: 0,
		}
		this.resources = {
			food: 10,
			wood: 5,
			gold: 0,
		}
		this.skills = {
			navigation: 1,
			negotiation: 1,
			survival: 1,
		}

		this.init()
	}

	update() {
		this.handleInteraction()
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

	handleInteraction() {
		this.interactionRequired =
			!!this.game.sceneManager?.activeScene?.dialogManager.currentOptions
	}

	init() {
		this.eventSystem.on('stopPlayerMotion', ({ side, object }) => {
			if (side) {
				// left
				if (this.velocity.x < 0 && side === 'left') {
					// detener movimiento horizontal <-
					this.velocity.x = 0
					this.x = object.x + object.width
				}

				// right
				if (this.velocity.x > 0 && side === 'right') {
					// detener movimiento horizontal ->
					this.velocity.x = 0
					this.x = object.x - this.width
				}

				// top
				if (this.velocity.y < 0 && side === 'top') {
					// detener movimiento horizontal <-
					this.velocity.y = 0
					this.y = object.y + object.height
				}

				// bottom
				if (this.velocity.y > 0 && side === 'bottom') {
					// detener movimiento horizontal ->
					this.velocity.y = 0
					this.y = object.y - this.height
				}
			}
		})
	}
}
