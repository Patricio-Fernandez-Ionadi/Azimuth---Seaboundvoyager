import { Keyboard } from './core/events/Keyboard.js'
import { EventSystem } from './core/events/EventSystem.js'
import { SceneManager } from './core/managers/SceneManager.js'
import { loadFonts } from './core/fonts.js'

import { ItemsManager } from './components/items/ItemsManager.js'
import { GameClock } from './core/managers/GameClock.js'
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

		/* Sistemas */
		this.keyboard = new Keyboard()
		this.eventSystem = new EventSystem()
		this.clock = new GameClock(this)
		this.lastFrameTime = Date.now()
		this.sceneManager = new SceneManager(this)
		this.itemsManager = new ItemsManager(this)

		this.player = new Player(100, 100, this)
		/* Pointer */
		this.customCursor = new CustomCursor(this)

		/* Escenas */
		this.sceneManager.addScene(SCENES.menu, new MenuScene(this))
		this.sceneManager.addScene(SCENES.creation, new NewGameScene(this))
		this.sceneManager.addScene(
			SCENES.map,
			new WorldMapScene(this, { name: 'world map' })
		)
		// cities
		this.sceneManager.addScene(
			SCENES.city.valeris.scene,
			new PuertoValerisScene(this, SCENES.city.valeris)
		)
		// Establecer escena inicial
		// this.sceneManager.changeScene(SCENES.menu, false)
		// this.sceneManager.changeScene(SCENES.creation)
		// this.sceneManager.changeScene(SCENES.map)
		this.sceneManager.changeScene(SCENES.city.valeris.scene)

		loadFonts()
		this.setupCanvas()
		this.animate()
	}

	/* Main Loop */
	animate(deltatime) {
		const currentTime = Date.now()
		const deltaTime = currentTime - this.lastFrameTime
		// limpieza canvas
		this.ctx.clearRect(0, 0, this.width, this.height)

		// Actualizaciones
		this.lastFrameTime = currentTime
		this.clock.update(deltaTime)
		this.sceneManager.update(deltatime)

		// Renderizados
		this.sceneManager.render()
		this.customCursor.draw(this.ctx)

		// loop
		requestAnimationFrame(() => this.animate())
	}

	/* Set Up */
	setupCanvas() {
		this.canvas.style.backgroundColor = '#222'
		this.canvas.width = this.width
		this.canvas.height = this.height
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
