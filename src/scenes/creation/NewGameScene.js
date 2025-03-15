import { UIManager } from '../../core/managers/UIManager.js'

import { Button } from '../../components/Button.js'
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
import { SCENES } from '../../core/constants.js'

export class NewGameScene {
	constructor(game) {
		this.game = game
		this.uiManager = new UIManager(this.game)

		// this.hoverInitButton = false
		// this.hoverBackButton = false

		/* Screen */
		this.backgroundImg = new Image()
		this.backgroundImg.src = '/src/scenes/creation/assets/background.jpg'
		this.initGame_button = new Button(
			btnX,
			btn1.y,
			btnWidth,
			btnHeight,
			'Comenzar',
			btnFz,
			btnPlr,
			btnPtb
		)
		this.back_button = new Button(
			btnX,
			btn2.y,
			btnWidth,
			btnHeight,
			'Atras',
			btnFz,
			btnPlr,
			btnPtb
		)

		this.initGame_button.onClick = () => {
			this.game.sceneManager.changeScene(SCENES.city.valeris)
		}
		this.back_button.onClick = () => {
			this.game.sceneManager.changeScene(SCENES.menu)
		}
		this.uiManager.addComponent(this.initGame_button)
		this.uiManager.addComponent(this.back_button)
	}

	onEnter() {
		console.log('Entrando en la escena: Creacion de Partida')
	}
	onExit() {
		console.log('Saliendo de la escena: Creacion de Partida')
	}
	handleClick(mouseX, mouseY, e) {
		this.uiManager.handleClick(mouseX, mouseY, e)
	}

	update(deltaTime) {
		// Lógica de actualización (si aplica)
	}

	render() {
		const { ctx } = this.game

		ctx.fillStyle = 'black'
		ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height)

		this.game.sceneManager.setBackground(this.backgroundImg)
		this.uiManager.renderComponents()
	}

	mouseMove(mouseX, mouseY, e) {
		this.initGame_button.handleHover(mouseX, mouseY)
		this.back_button.handleHover(mouseX, mouseY)
	}
}
