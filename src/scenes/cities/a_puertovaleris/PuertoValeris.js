import { CameraManager } from '../../../core/managers/CameraManager.js'
import { DialogManager } from '../../../core/managers/DialogManager.js'

import { NPC } from '../../../entities/NPC.js'
import { Button } from '../../../components/Button.js'
import { TradeWindow } from '../../../components/TradeWindow.js'

import { SCENES } from '../../../core/constants.js'
import { checkCollisions } from '../../../core/utils.js'

const MOCK_WIDTH = 1984 /* 124 * 16 */
const MOCK_HEIGHT = 1088 /* 68 * 16 */

const building = {
	x: 350,
	y: 100,
	width: 16 * 32,
	height: 200,
	color: 'white',
	id: 1,
}
const door = {
	x: 350 + 16 * 14,
	y: 210,
	width: 64,
	height: 90,
	color: 'red',
	id: 2,
}
const mockStructure = (ctx, camera, config) => {
	const { x, y, width, height, color } = config

	let newX = x - camera.x
	let newY = y - camera.y

	ctx.save()
	ctx.fillStyle = color
	ctx.fillRect(newX, newY, width, height)
	ctx.restore()
}

export class PuertoValerisScene {
	constructor(game, info) {
		this.game = game
		Object.keys(info).forEach((p) => (this[p] = info[p]))
		this.eventSystem = this.game.eventSystem
		this.keys = this.game.keyboard
		this.camera = new CameraManager(this.game)
		this.dialogManager = new DialogManager(this.game, this)

		/* DEV */
		this.collisions = []

		this.#init()
	}

	update() {
		const { ctx } = this.game
		this.checkNPCInteraction()
		this.handleNPCOptions()

		/* mock level objects for collisions */
		this.collisions.forEach((c) => {
			mockStructure(ctx, this.camera, c)
			const side = checkCollisions(this.game.player, c)
			if (side) {
				this.eventSystem.emit('colliding', { side, object: c })

				// collisionando con la puerta
				if (side === 'top' && c.id === 2) {
					const pl = this.game.player.x + this.game.player.width
					const pr = this.game.player.x
					const cl = c.x + c.width
					const cr = c.x

					if (pl < cl && pr > cr) {
						console.log('enter door')
					}
				}
			}
		})
		/* mock end */

		this.game.player.update()
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
		// console.log(this.game.clock.currentHour)
		this.npcs.forEach((e) => e.shop?.checkRestock(this.game.clock.currentHour))
	}

	render() {
		const { ctx } = this.game

		this.game.player.draw(ctx, this.camera)

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
			let canTalk =
				Math.abs(playerX - npc.x) < 50 && Math.abs(playerY - npc.y) < 50 // Jugador cerca del NPC

			if (canTalk) {
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
		this.npcs = this.npcs.map(
			(data) =>
				new NPC({
					x: data.x,
					y: data.y,
					color: data.color,
					dialogs: data.dialogs,
					shopConfig: data.shopConfig ?? data.shopConfig,
					game: this.game,
				})
		)

		// Agregamos objetos colisionables por el jugador
		this.npcs.forEach((npc) => this.collisions.push(npc))
		this.collisions.push(building)
		this.collisions.push(door)

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
}
