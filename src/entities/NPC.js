import { Shop } from '../components/Shop.js'

export class NPC {
  constructor(config) {
    this.game = config.game
    this.x = config.x
    this.y = config.y
    this.width = 32
    this.height = 32
    this.color = config.color
    this.dialogs = config.dialogs
    this.dialogPhases = config.dialogPhases ?? null
    this.dialogPhase = config.dialogPhase ?? 0
    this.isInteracting = false
    this.id = config.id
    this.shop = config.shopConfig ? new Shop(this, config.shopConfig) : null
  }

  update() {
    // Mentor: auto-interactuar solo en el primer encuentro
    if (this.id === 1 && this.isPlayerNear()) {
      if (!this.isInteracting && this.dialogPhase === 0) {
        this.interact()
      }
    }
  }
  draw(ctx, camera) {
    ctx.fillStyle = this.color
    ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height)
  }

  interact() {
    if (!this.isInteracting) {
      this.isInteracting = true
      if (this.dialogPhases) {
        this.dialogs = this.dialogPhases[this.dialogPhase]
      }
      this.game.eventSystem.emit('npcInteracted', this)
    }
  }

  endInteraction() {
    this.isInteracting = false
    if (this.dialogPhases) {
      this.dialogPhase = Math.min(this.dialogPhase + 1, this.dialogPhases.length - 1)
    }
    this.game.eventSystem.emit('interactionEnded', this)
  }

  isPlayerNear() {
    const dx = this.game.player.x - this.x
    const dy = this.game.player.y - this.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance < 150
  }
}
