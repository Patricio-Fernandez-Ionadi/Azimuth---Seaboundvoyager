/**
 * CityScene
 * ----------------------------------------------------------------------
 * Clase base para todas las escenas de ciudad/puerto. Centraliza la
 * lógica que antes estaba duplicada en los 22 archivos
 * `scenes/cities/ /<Nombre>.js`:
 *
 *   - Cámara, colisiones, NPCs (factory), suscripción a eventos.
 *   - Detección de proximidad y avance de diálogos con la tecla E.
 *   - Selección de opciones con W/S/Q.
 *   - Render del HUD y de la ventana de comercio cuando aplica.
 *
 * Para crear una ciudad nueva, basta con:
 *
 *   import { CityScene } from '../CityScene.js'
 *   import { rawMap } from './raw.js'
 *   import npcsData from './npcs.js'
 *
 *   export class MiCiudad extends CityScene {
 *     constructor(game, info) {
 *       super(game, info, {
 *         rawMap,
 *         npcsData,
 *         mapWidth: rawMap[0].length * 16,
 *         mapHeight: rawMap.length * 16,
 *         startX: 100,
 *         startY: 100,
 *       })
 *     }
 *   }
 *
 * Hooks opcionales que las subclases pueden sobreescribir:
 *   - onBeforeEnter()    -> ajustar el estado del player antes de entrar.
 *   - onAfterEnter()     -> lógica extra tras haber centrado la cámara.
 *   - onUpdate()         -> lógica adicional por frame.
 *   - onRender(ctx)      -> dibuja encima del mundo.
 */

import { CameraManager } from '../../core/managers/CameraManager.js'
import { DialogManager } from '../../core/managers/DialogManager.js'
import { Button } from '../../components/Button.js'
import { TradeWindow } from '../../components/TradeWindow.js'
import { CollisionBlock } from '../../core/components/CollisionBlock.js'
import { SCENES } from '../../core/constants.js'
import { createNPC } from '../../entities/npc/NPCFactory.js'

const TILE_SIZE = 16

/** Tile IDs que bloquean el paso (muros y agua). */
const COLLISION_TILE_IDS = [2, 10]

/** Color de fondo por tile ID (para render del mapa base). */
const TILE_COLORS = {
	0: '#1d2733', // piso neutral (oscuro)
	2: '#2b1d0e', // muro (marrón oscuro)
	5: '#3b2b1a', // muelle (madera)
	6: '#3a1d1d', // taberna (rojo oscuro)
	7: '#3d3214', // mercado (dorado oscuro)
	8: '#1d2a3a', // biblioteca (azul oscuro)
	9: '#4a4a3a', // camino (gris-verdoso)
	10: '#0a1a2a', // agua (azul muy oscuro)
}

export class CityScene {
	/**
	 * @param {Object} game
	 * @param {Object} info     Información "info" de constants.js (name, etc.)
	 * @param {Object} config
	 *   @param {Object}   config.rawMap       Mapa crudo (raw.js)
	 *   @param {Array}    config.npcsData     Array de datos de NPCs
	 *   @param {number}   config.mapWidth     Ancho total en píxeles
	 *   @param {number}   config.mapHeight    Alto total en píxeles
	 *   @param {number}   config.startX       Posición X inicial del player
	 *   @param {number}   config.startY       Posición Y inicial del player
	 *   @param {string}   [config.mapSceneKey] Key de SCENES para el botón mapa
	 *   @param {boolean}  [config.drawBorder]  Dibujar borde rojo del mundo
	 */
	constructor(game, info, config) {
		this.game = game
		this.eventSystem = game.eventSystem
		this.keys = game.keyboard
		Object.keys(info ?? {}).forEach((p) => (this[p] = info[p]))

		this.width = config.mapWidth
		this.height = config.mapHeight
		this.startX = config.startX ?? 80
		this.startY = config.startY ?? 390
		this.mapSceneKey = config.mapSceneKey ?? SCENES.map
		this.drawBorder = config.drawBorder ?? false

		this.camera = new CameraManager(this.game)
		this.dialogManager = new DialogManager(this.game, this)
		this.collisions = []
		this.keyPressed = false
		this.tradeWindow = null

		// Los NPCs se construyen en #init para asegurar orden correcto.
		this.npcs = []
		this.#init(config)
	}

	/* ============================================================
	 * Inicialización
	 * ============================================================ */

	#init(config) {
		this.camera.setMapBounds(this.width, this.height)
		this.rawMap = config.rawMap

		// Colisiones: muros (2) y agua (10) son impasables.
		this.collisions = []
		for (const id of COLLISION_TILE_IDS) {
			const blocks = config.rawMap.createObjectsFrom2D(
				CollisionBlock,
				id,
				TILE_SIZE,
			)
			this.collisions.push(...blocks)
		}

		// Construir NPCs vía factory (mantiene retrocompatibilidad).
		this.npcs = (config.npcsData ?? []).map((data) =>
			createNPC(data, this.game),
		)

		// Los NPCs son colisionables para el player.
		this.npcs.forEach((npc) => this.collisions.push(npc))

		// Suscripción a eventos emitidos por el NPC.
		this.eventSystem.on('npcInteracted', (npc) => {
			this.dialogManager.startDialogue(npc)
		})
		this.eventSystem.on('interactionEnded', () => {})
		this.eventSystem.on('playerTradeWindowOpen', ({ player, npc }) => {
			this.tradeWindow = new TradeWindow(this.game, player, npc)
		})
	}

	/* ============================================================
	 * Hooks de ciclo de vida
	 * ============================================================ */

	onEnter() {
		this.onBeforeEnter?.()
		this.game.player.x = this.startX
		this.game.player.y = this.startY
		if (this.camera.target !== this.game.player) {
			this.camera.setTarget(this.game.player)
		}
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
			this.game.sceneManager.changeScene(this.mapSceneKey)
		this.onAfterEnter?.()
	}

	onExit() {
		this.onBeforeExit?.()
	}

	/* ============================================================
	 * Loop principal
	 * ============================================================ */

	update() {
		this.checkNPCInteraction()
		this.handleNPCOptions()
		this.dialogManager.update()
		this.game.player.update(this.collisions)
		this.camera.update()
		this.#listenKeyRelease()

		if (this.keys.onPress.escape && this.tradeWindow) {
			this.tradeWindow.close()
		}
		this.npcs.forEach((e) => {
			e.shop?.checkRestock(this.game.clock.currentHour)
			e.update()
		})

		this.onUpdate?.()
	}

	render() {
		const { ctx } = this.game
		this.#renderMapTiles(ctx)
		this.collisions.forEach((c) => c.draw(ctx, this.camera))
		this.game.player.draw(ctx, this.camera)

		if (!this.game.player.menuGame.isOpen) this.map_button.draw(ctx)

		this.dialogManager.render()

		if (this.tradeWindow && this.game.player.inventory.tradeMode) {
			this.tradeWindow.draw(ctx)
		} else {
			this.game.renderLevelInterface()
		}

		if (this.drawBorder) this.#renderWorldBorder()
		this.onRender?.(ctx)
	}

	/** Dibuja cada tile del raw map con el color de su zona. */
	#renderMapTiles(ctx) {
		if (!this.rawMap) return
		for (let r = 0; r < this.rawMap.length; r++) {
			for (let c = 0; c < this.rawMap[r].length; c++) {
				const id = this.rawMap[r][c]
				const color = TILE_COLORS[id] ?? TILE_COLORS[0]
				ctx.fillStyle = color
				ctx.fillRect(
					c * TILE_SIZE - this.camera.x,
					r * TILE_SIZE - this.camera.y,
					TILE_SIZE,
					TILE_SIZE,
				)
			}
		}
	}

	/* ============================================================
	 * Interacción con NPC (E para hablar, W/S para opciones, Q)
	 * ============================================================ */

	checkNPCInteraction() {
		const playerX = this.game.player.x + this.game.player.width / 2
		const playerY = this.game.player.y + this.game.player.height / 2

		// 1) Elegir el NPC más cercano que tenga algo que decir y esté
		//    dentro de rango. Esto evita que un NPC "fantasma" (consumido
		//    y sin despedida) que esté en el array antes que otros válidos
		//    consuma la tecla E y bloquee al resto.
		let targetNpc = null
		let minDist = Infinity
		for (const npc of this.npcs) {
			if (!npc.hasDialog()) continue
			const inRange =
				npc.id === 'silas'
					? npc.isPlayerNear()
					: Math.abs(playerX - npc.x) < 50 &&
						Math.abs(playerY - npc.y) < 50
			if (!inRange) continue
			const dist = Math.hypot(playerX - npc.x, playerY - npc.y)
			if (dist < minDist) {
				targetNpc = npc
				minDist = dist
			}
		}

		// 2) Si el jugador se alejó del NPC con el que estaba hablando,
		//    cerramos ese diálogo.
		for (const npc of this.npcs) {
			if (npc.isInteracting && npc !== targetNpc) {
				this.dialogManager.endDialogue()
			}
		}

		if (!targetNpc) return
		if (!(this.keys.onPress.e && !this.keyPressed)) return

		if (!targetNpc.isInteracting) {
			// Sólo consumimos la E si el NPC efectivamente abrió diálogo.
			// Si no (consumido, sin despedida, etc.), dejamos que la tecla
			// siga disponible y el jugador pueda reintentarlo.
			if (targetNpc.interact()) {
				this.keyPressed = true
			}
		} else {
			this.keyPressed = true
			this.dialogManager.advanceDialogue()
		}
	}

	handleNPCOptions() {
		if (!this.dialogManager.currentNPC) return

		if (this.keys.onPress.w && !this.keyPressed) {
			this.keyPressed = true
			this.dialogManager.selectedOptionIndex = Math.max(
				0,
				this.dialogManager.selectedOptionIndex - 1,
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
					this.dialogManager.selectedOptionIndex + 1,
				)
			}
		} else if (this.keys.onPress.q && !this.keyPressed) {
			this.keyPressed = true
			this.dialogManager.selectOption(this.dialogManager.selectedOptionIndex)
		}
	}

	#listenKeyRelease() {
		if (
			!this.keys.onPress.w &&
			!this.keys.onPress.s &&
			!this.keys.onPress.q &&
			!this.keys.onPress.e
		) {
			this.keyPressed = false
		}
	}

	/* ============================================================
	 * Eventos de mouse
	 * ============================================================ */

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

	/* ============================================================
	 * Borde del mundo (opcional)
	 * ============================================================ */

	#renderWorldBorder() {
		const ctx = this.game.ctx
		ctx.strokeStyle = 'red'
		ctx.lineWidth = 4
		const left = -this.camera.x
		const top = -this.camera.y
		const right = this.width - this.camera.x
		const bottom = this.height - this.camera.y
		ctx.beginPath()
		ctx.moveTo(left, top)
		ctx.lineTo(right, top)
		ctx.stroke()
		ctx.beginPath()
		ctx.moveTo(right, top)
		ctx.lineTo(right, bottom)
		ctx.stroke()
		ctx.beginPath()
		ctx.moveTo(right, bottom)
		ctx.lineTo(left, bottom)
		ctx.stroke()
		ctx.beginPath()
		ctx.moveTo(left, bottom)
		ctx.lineTo(left, top)
		ctx.stroke()
	}
}
