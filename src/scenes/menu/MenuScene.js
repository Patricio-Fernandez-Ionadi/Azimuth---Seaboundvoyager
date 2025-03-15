import { Button } from '../../components/Button.js'
import { SCENES } from '../../core/constants.js'
import { UIManager } from '../../core/managers/UIManager.js'

import {
	btn1,
	btn2,
	btnFz,
	btnHeight,
	btnPlr,
	btnPtb,
	btnWidth,
	btnX,
} from '../constants.js'

export class MenuScene {
	constructor(game) {
		this.game = game
		this.uiManager = new UIManager(this.game)

		this.backgroundImg = new Image()
		this.backgroundImg.src = '/src/scenes/menu/assets/background.jpg'
	}

	onEnter() {
		console.log('Entrando en la escena: Menú Principal')
		// Crear botones
		this.newGameButton = new Button(
			btnX,
			btn1.y,
			btnWidth,
			btnHeight,
			'Crear Partida',
			btnFz,
			btnPlr,
			btnPtb
		)
		this.exitButton = new Button(
			btnX,
			btn2.y,
			btnWidth,
			btnHeight,
			'Salir',
			btnFz,
			btnPlr,
			btnPtb
		)

		this.newGameButton.onClick = () => {
			this.game.sceneManager.changeScene(SCENES.creation)
		}
		this.exitButton.onClick = () => {
			console.log('exit game')
		}
		// Añadir botones al UIManager
		this.uiManager.addComponent(this.newGameButton)
		this.uiManager.addComponent(this.exitButton)
	}
	onExit() {
		console.log('Saliendo de la escena: Menú Principal')
		// Limpiar el UIManager de esta escena
		this.uiManager.components.clear()
	}
	handleClick(mouseX, mouseY, e) {
		this.uiManager.handleClick(mouseX, mouseY, e)
	}
	mouseMove(mouseX, mouseY, e) {
		this.newGameButton.handleHover(mouseX, mouseY)
		this.exitButton.handleHover(mouseX, mouseY)
	}

	update(deltaTime) {
		// Lógica de actualización (si aplica)
	}

	render() {
		this.game.sceneManager.setBackground(this.backgroundImg)
		// Renderizar componentes del UIManager
		this.uiManager.renderComponents()
	}
}
