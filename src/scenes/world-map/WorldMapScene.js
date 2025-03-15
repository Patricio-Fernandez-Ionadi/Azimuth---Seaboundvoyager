import { UIManager } from '../../core/managers/UIManager.js'
import { MapManager } from '../../core/managers/MapManager.js'
import { PopupManager } from './components/PopupManager.js'
import { Button } from '../../components/Button.js'
import { SCENES } from '../../core/constants.js'
import { Camera } from '../../core/Camera.js'
import { WorldMap } from './WorldMap.js'

export class WorldMapScene {
	constructor(game) {
		this.game = game
		this.uiManager = new UIManager(this.game)
		this.mapManager = new MapManager(this.game)
		this.mapManager.loadMap('/src/scenes/world-map/data/world_map_pirates.json')
		this.map = new WorldMap(this.game)

		this.camera = new Camera(this)

		this.popupManager = new PopupManager(this)

		/* Eventos */
		this.game.eventSystem.on('citySelected', (city) => {
			console.log('Una ciudad fue seleccionada:', city)
		})
	}

	onEnter() {
		console.log('Entrando en la escena: World Map')
		this.map_button = new Button(
			this.game.width - 70,
			this.game.height - 70,
			50,
			50,
			'X',
			20,
			18,
			32
		)
		this.map_button.onClick = () => {
			this.game.sceneManager.changeScene(SCENES.city.valeris)
		}
		this.uiManager.addComponent(this.map_button)

		// seteo de limites de camara
		if (
			this.camera.mapWidth !== this.map.width ||
			this.camera.mapHeight !== this.map.height
		) {
			this.camera.setMapBounds(this.map.width, this.map.height)
		}
	}
	onExit() {
		console.log('Saliendo de la escena: World Map')
	}

	update(deltaTime) {}

	render() {
		this.map.draw(this.camera)
		this.renderZones()
		this.uiManager.renderComponents()
	}

	renderZones() {
		const { ctx } = this.game
		this.mapManager.zones.forEach((zone) => {
			ctx.strokeStyle = '#22222255'
			ctx.strokeRect(
				zone.x + this.camera.x,
				zone.y + this.camera.y,
				zone.width,
				zone.height
			)
			ctx.fillStyle = 'white'
			ctx.fillText(
				zone.name,
				zone.x + this.camera.x + 10,
				zone.y + this.camera.y + 20
			)
		})
	}

	handleClick(mouseX, mouseY, e) {
		this.uiManager.handleClick(mouseX, mouseY, e)

		const camX = mouseX - this.camera.x
		const camY = mouseY - this.camera.y

		const clickedZone = this.mapManager.getZoneAt(camX, camY)
		if (clickedZone) {
			this.game.eventSystem.emit('zoneClicked', {
				x: mouseX,
				y: mouseY,
				zone: clickedZone,
			})
		}
	}
	mouseDown(mouseX, mouseY, e) {
		this.camera.mouseDown(mouseX, mouseY, e)
	}
	mouseMove(mouseX, mouseY, e) {
		if (!this.game.interactionState.isPopupOpen) {
			this.camera.handleDrag(mouseX, mouseY, e)
		}
		this.uiManager.mouseMove(mouseX, mouseY, e)
	}
	mouseUp(mouseX, mouseY, e) {
		this.camera.mouseUp(mouseX, mouseY, e)
	}
}
