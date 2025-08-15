import { MenuGame } from '../components/menugame/MenuGame.js'
import { Inventory } from '../components/inventory/Inventory.js'
import { checkCollisions, loadImage } from '../core/utils.js'

export class Player {
  constructor(game) {
    this.game = game
    this.gameClock = this.game.clock
    this.eventSystem = this.game.eventSystem
    this.c = this.game.ctx
    this.x = 0
    this.y = 0
    this.width = 48
    this.height = 48
    this.color = '#ff000055'

    /* Fisicas */
    this.speed = 2
    this.velocity = { x: 0, y: 0 }
    this.colliding = null
    this.hitbox = {
      x: this.x,
      y: this.y,
      offsetX: 16,
      offsetY: 10,
      width: this.width - 16 * 2,
      height: this.height - 10 * 2,
    }

    /* Acciones */
    this.canShot = true
    this.shotCD = 3
    this.counter = 0

    /* Sprite */
    this.elapsedTime = 0
    this.sprite = {
      size: 24,
      frameBuffer: 120,
      frame: 0,
      current: 'stand',
      facing: 'bottom',
      states: {
        stand: {
          bottom: {
            x: 0,
            y: 0,
            frames: 1,
          },
          left: {
            x: 0,
            y: 24 * 3,
            frames: 1,
          },
          right: {
            x: 0,
            y: 24 * 6,
            frames: 1,
          },
          top: {
            x: 0,
            y: 24 * 9,
            frames: 1,
          },
        },
        walk: {
          bottom: {
            x: 0,
            y: 24 * 1,
            frames: 3,
          },
          left: {
            x: 0,
            y: 24 * 4,
            frames: 3,
          },
          right: {
            x: 0,
            y: 24 * 7,
            frames: 3,
          },
          top: {
            x: 0,
            y: 24 * 10,
            frames: 3,
          },
        },
        shot: {
          bottom: {
            x: 0,
            y: 24 * 2,
            frames: 1,
          },
          left: {
            x: 0,
            y: 24 * 5,
            frames: 1,
          },
          right: {
            x: 0,
            y: 24 * 8,
            frames: 1,
          },
          top: {
            x: 0,
            y: 24 * 11,
            frames: 1,
          },
        },
      },
      dir: {
        left: 'left',
        right: 'right',
        top: 'top',
        bot: 'bottom',
      },
      state: {
        walk: 'walk',
        idle: 'stand',
        shot: 'shot',
      },
      loaded: false,
    }
    this.sprite.current =
      this.sprite.states[this.sprite.current][this.sprite.facing]
    loadImage('/src/assets/characters/pirate/spritesheet.png').then((res) => {
      this.sprite.image = res
      this.sprite.loaded = true
    })

    /* Gameplay */
    this.inventory = new Inventory(this, 435, 20, false, 10)
    this.menuGame = new MenuGame(this)
    this.selectedTab = this.menuGame.defaultSelected

    this.stats = {
      hp: 100,
      hunger: 0,
      drunk: 0,
    }
    this.reputation = {
      pirates: 0,
      merchants: 0,
      explorers: 0,
    }
    this.resources = {
      food: 10,
      wood: 5,
      gold: 200000,
    }
    this.skills = {
      navigation: 1,
      negotiation: 1,
      survival: 1,
    }

    this.init()
  }

  draw() {
    const camera = this.game.sceneManager.activeScene.camera

    if (this.sprite.loaded) {
      this.c.drawImage(
        this.sprite.image,
        this.sprite.current.x + this.sprite.size * this.sprite.frame,
        this.sprite.current.y,
        this.sprite.size,
        this.sprite.size,
        this.x - camera.x,
        this.y - camera.y,
        this.width,
        this.height
      )
    }

    /* Draw Hitbox */
    // this.c.fillStyle = 'red'
    // this.c.fillRect(
    //   this.hitbox.x - camera.x,
    //   this.hitbox.y - camera.y,
    //   this.hitbox.width,
    //   this.hitbox.height
    // )

    this.menuGame.render()
  }
  update(collisions) {
    // 1. Procesar inputs -> setea velocity y sprite
    this.updateInputs()

    // 2. Movimiento por ejes
    // --- Eje X ---
    this.x += this.velocity.x
    this.updateHitbox()
    this.handleCollisions(collisions, 'x')

    // --- Eje Y ---
    this.y += this.velocity.y
    this.updateHitbox()
    this.handleCollisions(collisions, 'y')

    // 3. Animaciones y acciones
    this.handleShot()
    this.#updateSpriteFrame()
    this.handleOpenMenu()
    this.menuGame.update()
  }

  updateSprite(state, facing) {
    let fac = facing
    if (!fac) fac = this.sprite.facing

    if (this.sprite.current !== this.sprite.states[state][fac]) {
      this.sprite.current = this.sprite.states[state][fac]
      this.sprite.facing = fac
      this.sprite.frame = 0
    }
  }
  #updateSpriteFrame() {
    this.elapsedTime += this.gameClock.deltatime
    if (this.elapsedTime > this.sprite.frameBuffer) {
      this.sprite.frame = (this.sprite.frame + 1) % this.sprite.current.frames
      this.elapsedTime -= this.sprite.frameBuffer
    }
  }
  updateHitbox() {
    this.hitbox.x = this.x + this.hitbox.offsetX
    this.hitbox.y = this.y + this.hitbox.offsetY
  }

  handleCollisions(collisions, axis) {
    for (const block of collisions) {
      if (
        this.hitbox.x < block.x + block.width &&
        this.hitbox.x + this.hitbox.width > block.x &&
        this.hitbox.y < block.y + block.height &&
        this.hitbox.y + this.hitbox.height > block.y
      ) {
        if (axis === 'x') {
          if (this.velocity.x > 0) {
            // moviendo derecha
            this.x = block.x - this.width + this.hitbox.offsetX
          } else if (this.velocity.x < 0) {
            // moviendo izquierda
            this.x = block.x + block.width - this.hitbox.offsetX
          }
          this.velocity.x = 0
        }

        if (axis === 'y') {
          if (this.velocity.y > 0) {
            // moviendo abajo
            this.y = block.y - this.height + this.hitbox.offsetY
          } else if (this.velocity.y < 0) {
            // moviendo arriba
            this.y = block.y + block.height - this.hitbox.offsetY
          }
          this.velocity.y = 0
        }

        this.updateHitbox()
      }
    }
  }

  handleShot() {
    if (
      this.action.shot &&
      this.canShot &&
      this.sprite.current !== this.sprite.states.shot
    ) {
      this.keyPressed = true
      this.velocity.x = 0
      this.velocity.y = 0
      this.updateSprite(this.sprite.state.shot)
      this.canShot = false
    }

    if (!this.canShot && this.gameClock.tickUpdate) {
      this.counter += 1
      if (this.counter >= this.shotCD) {
        this.counter = 0
        this.canShot = true
      }
    }
  }
  handleOpenMenu() {
    if (
      this.game.keyboard.onPress.tab &&
      !this.keyPressed &&
      !this.inventory.tradeMode
    ) {
      this.keyPressed = true
      this.eventSystem.emit('toggle_menugame')
    }

    if (
      this.game.keyboard.onPress.escape &&
      !this.keyPressed &&
      this.menuGame.isOpen
    ) {
      this.keyPressed = true
      this.eventSystem.emit('toggle_menugame')
    }
  }

  mouseUp(mouseX, mouseY, e) {
    if (this.menuGame.isOpen) {
      this.menuGame.mouseUp(mouseX, mouseY, e)
    }
    this.inventory.mouseUp(mouseX, mouseY, e)
  }
  mouseDown(mouseX, mouseY, e) {
    this.inventory.mouseDown(mouseX, mouseY, e)
    this.menuGame.mouseDown(mouseX, mouseY, e)
  }
  mouseMove(mouseX, mouseY, e) {
    if (this.menuGame.isOpen) {
      this.menuGame.mouseMove(mouseX, mouseY, e)
    }
    this.inventory.mouseMove(mouseX, mouseY, e)
  }
  updateInputs() {
    if (!this.game.keyboard.pressed) this.keyPressed = false

    this.direction = {
      left: this.game.keyboard.onPress.a,
      right: this.game.keyboard.onPress.d,
      up: this.game.keyboard.onPress.w,
      bottom: this.game.keyboard.onPress.s,
    }
    this.action = {
      shot: this.game.keyboard.onPress.q,
    }

    const npcOptioning =
      !!this.game.sceneManager?.activeScene?.dialogManager.currentOptions
    const menuOpen = this.menuGame.isOpen

    const isShooting = this.sprite.current === this.sprite.state.shot

    this.interactionRequired = npcOptioning || menuOpen || isShooting

    // Si no se puede mover, velocidad = 0
    if (this.interactionRequired) {
      this.velocity.x = 0
      this.velocity.y = 0
      return
    }

    // Movimiento horizontal
    if (this.direction.left) {
      this.velocity.x = -this.speed
      if (!this.direction.up && !this.direction.bottom)
        this.updateSprite(this.sprite.state.walk, this.sprite.dir.left)
    } else if (this.direction.right) {
      this.velocity.x = this.speed
      if (!this.direction.up && !this.direction.bottom)
        this.updateSprite(this.sprite.state.walk, this.sprite.dir.right)
    } else {
      this.velocity.x = 0
    }
    // Movimiento vertical
    if (this.direction.up) {
      this.velocity.y = -this.speed
      this.updateSprite(this.sprite.state.walk, this.sprite.dir.top)
    } else if (this.direction.bottom) {
      this.velocity.y = this.speed
      this.updateSprite(this.sprite.state.walk, this.sprite.dir.bot)
    } else {
      this.velocity.y = 0
    }
    // Idle si no hay movimiento
    if (this.velocity.x === 0 && this.velocity.y === 0) {
      this.updateSprite(this.sprite.state.idle, this.sprite.facing)
    }
  }

  init() {
    const initialInventory = [
      this.game.itemsManager.getItem(111), // Carne de res
      this.game.itemsManager.getItem(712), // Gold Key
      this.game.itemsManager.getItem(1301), // Puñal
    ]
    this.inventory.addItem(initialInventory[0], 10, this)
    this.inventory.addItem(initialInventory[1], 1, this)
    this.inventory.addItem(initialInventory[2], 1, this)
  }
}
