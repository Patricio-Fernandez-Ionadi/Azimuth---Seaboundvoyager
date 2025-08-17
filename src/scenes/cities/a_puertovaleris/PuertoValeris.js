import { CameraManager } from '../../../core/managers/CameraManager.js'
import { DialogManager } from '../../../core/managers/DialogManager.js'

import { NPC } from '../../../entities/NPC.js'
import { Button } from '../../../components/Button.js'
import { TradeWindow } from '../../../components/TradeWindow.js'

import { SCENES } from '../../../core/constants.js'
import { rawMap } from './raw.js'
import { CollisionBlock } from '../../../core/components/CollisionBlock.js'

const MOCK_WIDTH = 1984 /* 124 * 16 */
const MOCK_HEIGHT = 1088 /* 68 * 16 */
const TILE_SIZE = 16

export class PuertoValerisScene {
  constructor(game, info) {
    this.game = game
    this.width = MOCK_WIDTH
    this.height = MOCK_HEIGHT
    Object.keys(info).forEach((p) => (this[p] = info[p]))
    this.eventSystem = this.game.eventSystem
    this.keys = this.game.keyboard
    this.camera = new CameraManager(this.game)
    this.dialogManager = new DialogManager(this.game, this)

    /* DEV */
    this.collisions = []

    this.#init()
  }

  fixToMap(x, y, size = 1) {
    return [x * size - this.camera.x, y * size - this.camera.y, size, size]
  }

  update() {
    this.checkNPCInteraction()
    this.handleNPCOptions()
    this.game.player.update(this.collisions)
    this.camera.update()

    if (
      !this.keys.onPress.w &&
      !this.keys.onPress.s &&
      !this.keys.onPress.q &&
      !this.keys.onPress.e
    ) {
      this.keyPressed = false
    }

    if (this.keys.onPress.escape && this.tradeWindow) {
      this.tradeWindow.close()
    }
    this.npcs.forEach((e) => {
      e.shop?.checkRestock(this.game.clock.currentHour)
      e.update()
    })
  }

  render() {
    const { ctx } = this.game
    this.renderWorldBorder()

    this.game.player.draw(ctx, this.camera)
    this.collisions.forEach((c) => c.draw(ctx, this.camera))

    // Ocultar con menu abierto
    if (!this.game.player.menuGame.isOpen) this.map_button.draw(ctx)

    // Renderizar diálogo activo
    this.dialogManager.renderDialogBox()
    this.dialogManager.renderOptionsBox()

    /* Interface / Emergent */
    if (this.tradeWindow && this.game.player.inventory.tradeMode)
      this.tradeWindow.draw(ctx)
    else this.game.renderLevelInterface()
  }

  checkNPCInteraction() {
    const playerX = this.game.player.x + this.game.player.width / 2
    const playerY = this.game.player.y + this.game.player.height / 2

    for (const npc of this.npcs) {
      // Verificar si el jugador está en zona de interaccion
      let canRegularTalk =
        Math.abs(playerX - npc.x) < 50 && Math.abs(playerY - npc.y) < 50 // Jugador cerca del NPC

      let mentorTalk = npc.isMentor

      if (canRegularTalk || mentorTalk) {
        if (this.keys.onPress.e && !this.keyPressed) {
          this.keyPressed = true
          // si esta inactivo, interactuar
          if (!npc.isInteracting) npc.interact()
          // si ya esta interaccionando avanzar conversacion
          else this.dialogManager.advanceDialogue()
        }
      } else {
        // Si el jugador se aleja, finalizar la interacción
        if (npc.isInteracting) this.dialogManager.endDialogue()
      }
    }
  }
  handleNPCOptions() {
    // Manejar entrada para selección de opciones
    if (this.dialogManager.currentNPC) {
      if (this.keys.onPress.w && !this.keyPressed) {
        this.keyPressed = true
        this.dialogManager.selectedOptionIndex = Math.max(
          0,
          this.dialogManager.selectedOptionIndex - 1
        )
      } else if (this.keys.onPress.s && !this.keyPressed) {
        this.keyPressed = true
        const currentDialog =
          this.dialogManager.currentNPC.dialogs[
            this.dialogManager.currentMessageIndex
          ]
        if (currentDialog?.options) {
          this.dialogManager.selectedOptionIndex = Math.min(
            currentDialog.options.length - 1,
            this.dialogManager.selectedOptionIndex + 1
          )
        }
      } else if (this.keys.onPress.q && !this.keyPressed) {
        this.keyPressed = true
        this.dialogManager.selectOption(this.dialogManager.selectedOptionIndex)
      }
    }
  }

  /* Load/Unload */
  #init() {
    this.camera.setMapBounds(MOCK_WIDTH, MOCK_HEIGHT)
    this.collisions = rawMap.createObjectsFrom2D(CollisionBlock, 2, TILE_SIZE)

    this.npcs = this.npcs.map(
      (data) =>
        new NPC({
          x: data.x,
          y: data.y,
          color: data.color,
          dialogs: data.dialogs,
          shopConfig: data.shopConfig ?? data.shopConfig,
          game: this.game,
          isMentor: data.isMentor ? data.isMentor : false,
        })
    )

    // Agregamos objetos colisionables por el jugador
    this.npcs.forEach((npc) => this.collisions.push(npc))
    // this.collisions.push(building)
    // this.collisions.push(door)

    /* Suscripcion a eventos */
    this.eventSystem.on('npcInteracted', (npc) => {
      this.dialogManager.startDialogue(npc)
    })
    this.eventSystem.on('interactionEnded', (npc) => {
      // console.log(`Fin de interacción con NPC en (${npc.x}, ${npc.y})`)
    })
    this.eventSystem.on('playerTradeWindowOpen', ({ player, npc }) => {
      this.tradeWindow = new TradeWindow(this.game, player, npc)
    })
  }
  onEnter() {
    this.game.player.x = 80
    this.game.player.y = 390
    // Configurar la cámara para seguir al jugador
    if (this.game.player && this.camera.target !== this.game.player)
      this.camera.setTarget(this.game.player)

    this.map_button = new Button(
      this.game.width - 70,
      this.game.height - 70,
      50,
      50,
      'Map',
      20,
      5,
      32
    )
    this.map_button.onClick = () =>
      this.game.sceneManager.changeScene(SCENES.map)
  }
  onExit() {}

  /* Events */
  handleClick(mouseX, mouseY, e) {
    if (!this.game.player.menuGame.isOpen)
      this.map_button.handleClick(mouseX, mouseY, e)
  }
  mouseDown(mouseX, mouseY, e) {
    if (this.tradeWindow) this.tradeWindow.mouseDown(mouseX, mouseY, e)
  }
  mouseMove(mouseX, mouseY, e) {
    if (!this.game.player.menuGame.isOpen)
      this.map_button.handleHover(mouseX, mouseY, e)

    if (this.tradeWindow) this.tradeWindow.mouseMove(mouseX, mouseY, e)
  }
  mouseUp(mouseX, mouseY, e) {
    if (this.tradeWindow) this.tradeWindow.mouseUp(mouseX, mouseY, e)
  }

  /* Dev */
  renderWorldBorder() {
    // Configura el color y grosor de las líneas
    this.game.ctx.strokeStyle = 'red' // Color rojo
    this.game.ctx.lineWidth = 4 // Grosor de la línea

    const left = -this.camera.x
    const top = -this.camera.y
    const right = this.width - this.camera.x
    const bottom = this.height - this.camera.y

    // Dibuja el borde superior
    // top left to top right
    this.game.ctx.beginPath()
    this.game.ctx.moveTo(left, top) // Inicia en esq. sup. izq.
    this.game.ctx.lineTo(right, top) // hasta esq. sup. der.
    this.game.ctx.stroke()

    // Dibuja el borde derecho
    // top right to bottom right
    this.game.ctx.beginPath()
    this.game.ctx.moveTo(right, top) // Inicia en esq. sup. der.
    this.game.ctx.lineTo(right, bottom) // hasta esq. inf. der.
    this.game.ctx.stroke()

    // Dibuja el borde inferior
    // bottom right to bottom left
    this.game.ctx.beginPath()
    this.game.ctx.moveTo(right, bottom) // Inicia en esq. inf. der.
    this.game.ctx.lineTo(left, bottom) // hasta esq. inf. izq.
    this.game.ctx.stroke()

    // Dibuja el borde izquierdo
    // bottom left to top left
    this.game.ctx.beginPath()
    this.game.ctx.moveTo(left, bottom) // Inicia en esq. inf. izq.
    this.game.ctx.lineTo(left, top) // hasta esq. sup. izq.
    this.game.ctx.stroke()
  }
}
