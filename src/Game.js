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
import * as Cities from './scenes/cities/index.js'
import { QuestManager } from './core/managers/QuestManager.js'
import { SkillManager } from './core/managers/SkillManager.js'
import { AffinityManager } from './core/managers/AffinityManager.js'

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

		this.player = new Player(this)
		this.skillManager = new SkillManager(this)
		this.affinityManager = new AffinityManager(this)
		this.questManager = new QuestManager(this)
		this.questManager.bindEvents()
		/* Pointer */
		this.customCursor = new CustomCursor(this)

		/* Escenas */
		this.sceneManager.addScene(SCENES.menu, new MenuScene(this))
		this.sceneManager.addScene(SCENES.creation, new NewGameScene(this))
		this.sceneManager.addScene(SCENES.map, new WorldMapScene(this))
		// cities
		this.sceneManager.addScene(
			SCENES.city.valeris.scene,
			new Cities.PuertoValerisScene(this, SCENES.city.valeris),
		)
		this.sceneManager.addScene(
			SCENES.city.bahiadeloslamentos.scene,
			new Cities.BahiaDeLosLamentosScene(this, SCENES.city.bahiadeloslamentos),
		)
		this.sceneManager.addScene(
			SCENES.city.ciudadluzmar.scene,
			new Cities.CiudadLuzmarScene(this, SCENES.city.ciudadluzmar),
		)
		this.sceneManager.addScene(
			SCENES.city.fuertedragal.scene,
			new Cities.FuerteDragalScene(this, SCENES.city.fuertedragal),
		)
		this.sceneManager.addScene(
			SCENES.city.marjaloscuro.scene,
			new Cities.MarjalOscuroScene(this, SCENES.city.marjaloscuro),
		)
		this.sceneManager.addScene(
			SCENES.city.bastiondemedianoche.scene,
			new Cities.BastionDeMedianocheScene(
				this,
				SCENES.city.bastiondemedianoche,
			),
		)
		this.sceneManager.addScene(
			SCENES.city.puertosombrio.scene,
			new Cities.PuertoSombrioScene(this, SCENES.city.puertosombrio),
		)
		this.sceneManager.addScene(
			SCENES.city.ciudadaurea.scene,
			new Cities.CiudadAureaScene(this, SCENES.city.ciudadaurea),
		)
		this.sceneManager.addScene(
			SCENES.city.puertodelasmareas.scene,
			new Cities.PuertoDeLasMareasScene(this, SCENES.city.puertodelasmareas),
		)
		this.sceneManager.addScene(
			SCENES.city.rocadeltrueno.scene,
			new Cities.RocaDelTruenoScene(this, SCENES.city.rocadeltrueno),
		)
		this.sceneManager.addScene(
			SCENES.city.arrecifecarmesi.scene,
			new Cities.ArrecifeCarmesiScene(this, SCENES.city.arrecifecarmesi),
		)
		this.sceneManager.addScene(
			SCENES.city.fuertesanguinario.scene,
			new Cities.FuerteSanguinarioScene(this, SCENES.city.fuertesanguinario),
		)
		this.sceneManager.addScene(
			SCENES.city.puertomistral.scene,
			new Cities.PuertoMistralScene(this, SCENES.city.puertomistral),
		)
		this.sceneManager.addScene(
			SCENES.city.islabrumaris.scene,
			new Cities.IslaBrumarisScene(this, SCENES.city.islabrumaris),
		)
		this.sceneManager.addScene(
			SCENES.city.puertoespejomar.scene,
			new Cities.PuertoEspejomarScene(this, SCENES.city.puertoespejomar),
		)
		this.sceneManager.addScene(
			SCENES.city.isladelosnaufragios.scene,
			new Cities.IslaDeLosNaufragiosScene(
				this,
				SCENES.city.isladelosnaufragios,
			),
		)
		this.sceneManager.addScene(
			SCENES.city.refugiocorsario.scene,
			new Cities.RefugioCorsarioScene(this, SCENES.city.refugiocorsario),
		)
		this.sceneManager.addScene(
			SCENES.city.caladelexilio.scene,
			new Cities.CalaDelExilioScene(this, SCENES.city.caladelexilio),
		)
		this.sceneManager.addScene(
			SCENES.city.isladelabismo.scene,
			new Cities.IslaDelAbismoScene(this, SCENES.city.isladelabismo),
		)
		this.sceneManager.addScene(
			SCENES.city.isladelossusurros.scene,
			new Cities.IslaDeLosSusurrosScene(this, SCENES.city.isladelossusurros),
		)
		this.sceneManager.addScene(
			SCENES.city.caletaespectral.scene,
			new Cities.CaletaEspectralScene(this, SCENES.city.caletaespectral),
		)
		this.sceneManager.addScene(
			SCENES.city.ciudadmercaris.scene,
			new Cities.CiudadMercarisScene(this, SCENES.city.ciudadmercaris),
		)
		this.sceneManager.addScene(
			SCENES.city.villatempestad.scene,
			new Cities.VillaTempestadScene(this, SCENES.city.villatempestad),
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
		// Reloj
		const currentTime = Date.now()
		const deltaTime = currentTime - this.lastFrameTime
		this.lastFrameTime = currentTime
		this.clock.update(deltaTime)

		// Limpieza canvas
		this.ctx.clearRect(0, 0, this.width, this.height)

		// Actualizaciones
		this.sceneManager.update(deltatime)

		// Renderizados
		this.sceneManager.render()
		this.customCursor.draw(this.ctx)

		// Loop
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
