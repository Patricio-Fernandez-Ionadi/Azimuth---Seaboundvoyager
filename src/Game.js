import { Keyboard } from './core/events/Keyboard.js'
import { EventSystem } from './core/events/EventSystem.js'
import { SceneManager } from './core/managers/SceneManager.js'
import { loadFonts } from './core/fonts.js'

import { ItemsManager } from './components/items/ItemsManager.js'
import { GameClock } from './components/GameClock.js'
import { CustomCursor } from './components/CustomCursor.js'
import { Text } from './components/Text.js'

import { Player } from './entities/player.js'

import { SCENES } from './core/constants.js'
import { MenuScene } from './scenes/menu/MenuScene.js'
import { NewGameScene } from './scenes/creation/NewGameScene.js'
import { WorldMapScene } from './scenes/world-map/WorldMapScene.js'
import { PuertoValerisScene } from './scenes/cities/a_puertovaleris/PuertoValeris.js'

export class Game {
	constructor() {
		this.root = document.getElementById('root')
		this.canvas = this.root.appendChild(document.createElement('canvas'))
		this.ctx = this.canvas.getContext('2d')

		/* Ventana */
		this.tileSize = 16
		this.viewport = [16, 9]
		this.screenScale = 3
		this.cols = this.viewport[0] * this.screenScale
		this.rows = this.viewport[1] * this.screenScale
		this.width = this.tileSize * this.cols
		this.height = this.tileSize * this.rows

		/* Pointer */
		this.customCursor = new CustomCursor(this)

		/* Sistemas */
		this.itemsManager = new ItemsManager(this)
		this.keyboard = new Keyboard()
		this.eventSystem = new EventSystem()
		this.sceneManager = new SceneManager(this)
		this.clock = new GameClock(this)
		this.lastFrameTime = Date.now()

		this.player = new Player(100, 100, this)

		/* Escenas */
		this.sceneManager.addScene(SCENES.menu, new MenuScene(this))
		this.sceneManager.addScene(SCENES.creation, new NewGameScene(this))
		this.sceneManager.addScene(SCENES.map, new WorldMapScene(this))
		// cities
		this.sceneManager.addScene(
			SCENES.city.valeris,
			new PuertoValerisScene(this)
		)
		// Establecer escena inicial
		// this.sceneManager.changeScene(SCENES.menu, false)
		// this.sceneManager.changeScene(SCENES.creation)
		// this.sceneManager.changeScene(SCENES.map)
		this.sceneManager.changeScene(SCENES.city.valeris)

		/* Estados */
		this.interactionState = {
			isPopupOpen: false,
			isButtonClicked: false,
		}

		loadFonts()
		this.setupCanvas()
		this.setupEvents()
		this.animate()
	}

	/* Main Loop */
	animate(deltatime) {
		const currentTime = Date.now()
		const deltaTime = currentTime - this.lastFrameTime
		this.lastFrameTime = currentTime
		this.clock.update(deltaTime) // Actualizar el reloj del juego

		this.ctx.clearRect(0, 0, this.width, this.height)
		this.sceneManager.update(deltatime)

		// Renderizados
		this.sceneManager.render()
		this.customCursor.draw(this.ctx)

		requestAnimationFrame(() => this.animate())
	}

	/* Set Up */
	setupCanvas() {
		this.canvas.style.backgroundColor = '#222'
		this.canvas.width = this.width
		this.canvas.height = this.height
	}
	setupEvents() {
		this.input = { mouseX: 0, mouseY: 0 }
		this.canvas.addEventListener('click', (e) => this.handleClick(e))

		/* Drag */
		this.canvas.addEventListener('mousedown', (e) => this.mouseDown(e))
		this.canvas.addEventListener('mouseup', (e) => this.mouseUp(e))
		this.canvas.addEventListener('mousemove', (e) => this.mouseMove(e))
	}

	/* Events */
	handleClick(e) {
		const mouseX = e.offsetX
		const mouseY = e.offsetY
		const activeScene = this.sceneManager.activeScene
		if (activeScene) activeScene.handleClick?.(mouseX, mouseY, e)
		this.player.handleClick(mouseX, mouseY, e)
	}
	mouseDown(e) {
		const mouseX = e.offsetX
		const mouseY = e.offsetY
		const activeScene = this.sceneManager.activeScene
		if (activeScene) activeScene.mouseDown?.(mouseX, mouseY, e)

		this.player.mouseDown(mouseX, mouseY, e)
		this.customCursor.setModel('left')
	}
	mouseUp(e) {
		const mouseX = e.offsetX
		const mouseY = e.offsetY
		const activeScene = this.sceneManager.activeScene
		if (activeScene) activeScene.mouseUp?.(mouseX, mouseY, e)

		this.player.mouseUp(mouseX, mouseY, e)
		this.customCursor.setModel('right')
	}
	mouseMove(e) {
		const mouseX = e.offsetX
		const mouseY = e.offsetY
		this.input.mouseX = e.offsetX
		this.input.mouseY = e.offsetY
		const activeScene = this.sceneManager.activeScene
		if (activeScene) activeScene.mouseMove?.(mouseX, mouseY, e)

		this.player.mouseMove(mouseX, mouseY, e)
		this.customCursor.updatePosition(mouseX, mouseY, e)
	}

	/* Others */
	renderLevelInterface() {
		Text({
			x: 10,
			y: 20,
			ctx: this.ctx,
			label: this.clock.getTime(),
			type: 'Pirate One',
			size: 20,
		})
		Text({
			x: 70,
			y: 20,
			ctx: this.ctx,
			label: `Oro: ${this.player.resources.gold}`,
			type: 'Pirate One',
			size: 20,
		})
	}
}
