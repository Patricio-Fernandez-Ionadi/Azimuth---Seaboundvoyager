import { UIManager } from '../../core/managers/UIManager.js'
import { MenuButton } from '../../components/MenuButton.js'

import { SCENES } from '../../core/constants.js'
import { loadImage } from '../../core/utils.js'

const BG_IMG = '/src/scenes/menu/assets/background.jpg'

export class MenuScene {
	constructor(game) {
		this.game = game
		this.uiManager = new UIManager(this.game)

		this.loaded = false
		loadImage(BG_IMG).then((res) => {
			this.bg = res
			this.loaded = true
		})
	}

	update() {}

	render() {
		if (this.loaded) {
			this.game.sceneManager.setBackground(this.bg)
			this.uiManager.renderComponents()
		} else {
			// renderizar pantalla de carga
		}
	}

	/* Load/Unload */
	onEnter() {
		const goCreate = () => this.game.sceneManager.changeScene(SCENES.creation)

		/* BOTONES DE INTERFAZ */
		this.newGameButton = new MenuButton(1, 'Crear Partida')
		this.newGameButton.onEvent(goCreate)
		this.uiManager.addComponent(this.newGameButton)

		this.exitButton = new MenuButton(2, 'Salir')
		this.exitButton.onEvent(() => console.log('exit game'))
		this.uiManager.addComponent(this.exitButton)
	}
	onExit() {
		this.uiManager.components.clear()
	}

	/* Events */
	handleClick(mouseX, mouseY, e) {
		this.uiManager.handleClick(mouseX, mouseY, e)
	}
	mouseMove(mouseX, mouseY, e) {
		this.uiManager.mouseMove(mouseX, mouseY, e)
	}
}
