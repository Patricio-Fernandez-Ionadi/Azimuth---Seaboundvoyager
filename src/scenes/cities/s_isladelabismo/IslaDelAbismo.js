import { CameraManager } from '../../../core/managers/CameraManager.js'
import { DialogManager } from '../../../core/managers/DialogManager.js'
import { NPC } from '../../../entities/NPC.js'
import { Button } from '../../../components/Button.js'
import { TradeWindow } from '../../../components/TradeWindow.js'
import { SCENES } from '../../../core/constants.js'
import { rawMap } from './raw.js'
import { CollisionBlock } from '../../../core/components/CollisionBlock.js'

const TILE_SIZE = 16
const COLS = rawMap[0].length
const ROWS = rawMap.length
const MAP_WIDTH = COLS * TILE_SIZE
const MAP_HEIGHT = ROWS * TILE_SIZE

export class IslaDelAbismo {
  constructor(game, info) {
    this.game = game
    this.width = MAP_WIDTH
    this.height = MAP_HEIGHT
    Object.keys(info).forEach((p) => (this[p] = info[p]))
    this.eventSystem = this.game.eventSystem
    this.keys = this.game.keyboard
    this.camera = new CameraManager(this.game)
    this.dialogManager = new DialogManager(this.game, this)
    this.collisions = []
    this.#init()
  }

  update() {
    this.checkNPCInteraction()
    this.handleNPCOptions()
    this.game.player.update(this.collisions)
    this.camera.update()
    this.#listentKeyRelease()

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
    this.collisions.forEach((c) => c.draw(ctx, this.camera))
    this.game.player.draw(ctx, this.camera)

    if (!this.game.player.menuGame.isOpen) this.map_button.draw(ctx)

    this.dialogManager.renderDialogBox()
    this.dialogManager.renderOptionsBox()

    if (this.tradeWindow && this.game.player.inventory.tradeMode)
      this.tradeWindow.draw(ctx)
    else this.game.renderLevelInterface()
  }

  checkNPCInteraction() {
    const playerX = this.game.player.x + this.game.player.width / 2
    const playerY = this.game.player.y + this.game.player.height / 2

    for (const npc of this.npcs) {
      const canRegularTalk =
        Math.abs(playerX - npc.x) < 50 && Math.abs(playerY - npc.y) < 50

      if (canRegularTalk) {
        if (this.keys.onPress.e && !this.keyPressed) {
          this.keyPressed = true
          if (!npc.isInteracting) npc.interact()
          else this.dialogManager.advanceDialogue()
        }
      } else {
        if (npc.isInteracting) this.dialogManager.endDialogue()
      }
    }
  }
  handleNPCOptions() {
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

  #listentKeyRelease() {
    if (
      !this.keys.onPress.w &&
      !this.keys.onPress.s &&
      !this.keys.onPress.q &&
      !this.keys.onPress.e
    ) {
      this.keyPressed = false
    }
  }

  #init() {
    this.camera.setMapBounds(MAP_WIDTH, MAP_HEIGHT)
    this.collisions = rawMap.createObjectsFrom2D(CollisionBlock, 2, TILE_SIZE)

    this.npcs = this.npcs.map(
      (data) =>
        new NPC({
          x: data.x,
          y: data.y,
          color: data.color,
          dialogs: data.dialogs,
          dialogPhases: data.dialogPhases ?? null,
          shopConfig: data.shopConfig ?? null,
          game: this.game,
          id: data.id,
        }),
    )

    this.npcs.forEach((npc) => this.collisions.push(npc))

    this.eventSystem.on('npcInteracted', (npc) => {
      this.dialogManager.startDialogue(npc)
    })
    this.eventSystem.on('interactionEnded', () => {})
    this.eventSystem.on('playerTradeWindowOpen', ({ player, npc }) => {
      this.tradeWindow = new TradeWindow(this.game, player, npc)
    })
  }
  onEnter() {
    this.game.player.x = MAP_WIDTH / 2
    this.game.player.y = MAP_HEIGHT / 2
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
      32,
    )
    this.map_button.onClick = () =>
      this.game.sceneManager.changeScene(SCENES.map)
  }
  onExit() {}

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
}
