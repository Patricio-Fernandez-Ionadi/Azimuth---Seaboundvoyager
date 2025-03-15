import { EventSystem } from './core/EventSystem.js'
import { SceneManager } from './core/managers/SceneManager.js'

import { MenuScene } from './scenes/menu/MenuScene.js'
import { NewGameScene } from './scenes/creation/NewGameScene.js'
import { WorldMapScene } from './scenes/world-map/WorldMapScene.js'

import { CustomCursor } from './components/CustomCursor.js'

import { Player } from './entities/player/player.js'
import { PuertoValerisScene } from './scenes/cities/PuertoValeris.js'
import { SCENES } from './core/constants.js'

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

		this.keys = {}

		this.player = new Player(100, 100, this)

		/* Sistemas */
		this.eventSystem = new EventSystem()

		this.sceneManager = new SceneManager(this)

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
		// this.sceneManager.changeScene(SCENES.map)
		this.sceneManager.changeScene(SCENES.city.valeris)

		/* Estados */
		this.interactionState = {
			isPopupOpen: false,
			isButtonClicked: false,
		}
		this.setupCanvas()
		this.setupEvents()
		this.animate()
	}

	setupCanvas() {
		this.canvas.style.backgroundColor = '#222'
		this.canvas.width = this.width
		this.canvas.height = this.height
	}
	setupEvents() {
		this.canvas.addEventListener('click', (e) => this.handleClick(e))

		/* Drag */
		this.canvas.addEventListener('mousedown', (e) => this.mouseDown(e))
		this.canvas.addEventListener('mouseup', (e) => this.mouseUp(e))
		this.canvas.addEventListener('mousemove', (e) => this.mouseMove(e))

		window.addEventListener('keydown', (e) => (this.keys[e.key] = true))
		window.addEventListener('keyup', (e) => (this.keys[e.key] = false))
	}

	handleClick(e) {
		const activeScene = this.sceneManager.activeScene
		if (activeScene) {
			const mouseX = e.offsetX
			const mouseY = e.offsetY
			activeScene.handleClick?.(mouseX, mouseY, e)
		}
	}
	mouseDown(e) {
		const activeScene = this.sceneManager.activeScene
		if (activeScene) {
			const mouseX = e.offsetX
			const mouseY = e.offsetY
			activeScene.mouseDown?.(mouseX, mouseY, e)
		}

		this.customCursor.setModel('left')
	}
	mouseUp(e) {
		const activeScene = this.sceneManager.activeScene
		if (activeScene) {
			const mouseX = e.offsetX
			const mouseY = e.offsetY
			activeScene.mouseUp?.(mouseX, mouseY, e)
		}

		this.customCursor.setModel('right')
	}
	mouseMove(e) {
		const mouseX = e.offsetX
		const mouseY = e.offsetY
		const activeScene = this.sceneManager.activeScene
		if (activeScene) {
			activeScene.mouseMove?.(mouseX, mouseY, e)
		}

		this.customCursor.updatePosition(mouseX, mouseY)
	}

	animate(deltatime) {
		this.ctx.clearRect(0, 0, this.width, this.height)
		this.sceneManager.update(deltatime)

		// Renderizados
		this.sceneManager.render()
		this.customCursor.draw(this.ctx)

		requestAnimationFrame(() => this.animate())
	}
}
