import { Inventory } from '../components/inventory/Inventory.js'

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
		this.speed = 3
		this.velocity = { x: 0, y: 0 }
		this.colliding = null

		/* Gameplay */
		// this.health = 100
		// this.hunger = 0
		// this.drunk = 0

		// Inventario
		this.inventory = new Inventory(this, 435, 20, false, 10)

		this.reputation = {
			pirates: 0,
			merchants: 0,
			explorers: 0,
		}
		this.resources = {
			food: 10,
			wood: 5,
			gold: 200,
		}
		this.skills = {
			navigation: 1,
			negotiation: 1,
			survival: 1,
		}

		this.init()
	}

	update() {
		this.updateInputs()
		this.horizontalMovement()
		this.verticalMovemet()

		// Abrir/Cerrar inventario
		if (this.game.keyboard.onPress.tab && !this.keyPressed) {
			this.keyPressed = true
			this.inventory.isOpen = !this.inventory.isOpen
		}

		this.y += this.velocity.y
		this.x += this.velocity.x
	}

	draw(ctx, camera) {
		ctx.fillStyle = this.color
		ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height)

		this.inventory.isOpen && this.inventory.draw(ctx)
	}

	/* Movement */
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

	/* Events */
	mouseUp(mouseX, mouseY, e) {
		this.inventory.mouseUp(mouseX, mouseY, e)
	}
	mouseDown(mouseX, mouseY, e) {
		this.inventory.mouseDown(mouseX, mouseY, e)
	}

	mouseMove(mouseX, mouseY, e) {
		this.inventory.mouseMove(mouseX, mouseY, e)
	}
	handleClick(mouseX, mouseY, e) {}
	updateInputs() {
		this.direction = {
			left: this.game.keyboard.onPress.a,
			right: this.game.keyboard.onPress.d,
			up: this.game.keyboard.onPress.w,
			bottom: this.game.keyboard.onPress.s,
		}
		if (!this.game.keyboard.onPress.tab) {
			this.keyPressed = false
		}
		this.interactionRequired =
			!!this.game.sceneManager?.activeScene?.dialogManager.currentOptions
	}

	/* Load */
	init() {
		const initialInventory = [
			this.game.itemsManager.getItem(10), // Carne de res
			this.game.itemsManager.getItem(1), // Gold Key
			this.game.itemsManager.getItem(13), // Puñal
		]
		this.inventory.addItem(initialInventory[0], 10)
		this.inventory.addItem(initialInventory[1], 1)
		this.inventory.addItem(initialInventory[2], 1)

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
