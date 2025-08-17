import { Shop } from '../components/Shop.js'

export class NPC {
  constructor(config) {
    this.game = config.game
    this.x = config.x
    this.y = config.y
    this.width = 32
    this.height = 32
    this.color = config.color
    this.dialogs = config.dialogs // Array de mensajes
    this.isInteracting = false
    this.hasInteracted = false
    this.isMentor = config.isMentor

    // console.log(shopConfig)
    this.shop = config.shopConfig ? new Shop(this, config.shopConfig) : null
  }

  update() {
    // Si es un mentor y el jugador entra en rango, dispara automáticamente
    if (this.isMentor && !this.hasInteracted && this.isPlayerNear()) {
      console.log('player en rango')
      this.hasInteracted = true
      this.game.eventSystem.emit('npcInteracted', this)
    }
  }
  draw(ctx, camera) {
    ctx.fillStyle = this.color
    ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height)
  }

  interact() {
    if (!this.isInteracting) {
      this.isInteracting = true
      this.game.eventSystem.emit('npcInteracted', this)
    }
  }

  endInteraction() {
    this.isInteracting = false
    this.game.eventSystem.emit('interactionEnded', this)
  }

  isPlayerNear() {
    const dx = this.game.player.x - this.x
    const dy = this.game.player.y - this.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance < 150 // rango configurable
  }
}
