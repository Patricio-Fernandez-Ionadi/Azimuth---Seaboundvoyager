import { UIManager } from '../../core/managers/UIManager.js'
import { MenuButton } from '../../components/MenuButton.js'
import { Panel } from '../../components/Panel.js'

import { SCENES } from '../../core/constants.js'
import { loadImage } from '../../core/utils.js'

const BG_IMG = '/src/scenes/menu/assets/background.jpg'

export class MenuScene {
	constructor(game) {
		this.game = game
		this.uiManager = new UIManager(this.game)

		/* Layout del panel y los botones (centrado) */
		this.panelW = 460
		this.panelH = 280
		this.panelX = (this.game.width - this.panelW) / 2
		this.panelY = (this.game.height - this.panelH) / 2
		this.btnX = this.panelX + 80
		this.btnW = 300
		this.btnH = 50
		this.btn1Y = this.panelY + 100
		this.btn2Y = this.btn1Y + this.btnH + 20

		this.loaded = false
		loadImage(BG_IMG).then((res) => {
			this.bg = res
			this.loaded = true
		})
	}

	update() {}

	render() {
		const { ctx } = this.game

		if (this.loaded) {
			this.game.sceneManager.setBackground(this.bg)
			/* Panel temático detrás de los botones */
			new Panel({
				x: this.panelX,
				y: this.panelY,
				width: this.panelW,
				height: this.panelH,
				title: 'Piratas',
			}).draw(ctx)
			this.uiManager.renderComponents()
		} else {
			/* pantalla de carga */
		}
	}

	/* Load/Unload */
	onEnter() {
		const goCreate = () => this.game.sceneManager.changeScene(SCENES.creation)

		this.newGameButton = new MenuButton(1, 'Crear Partida', {
			theme: 'parchment',
			x: this.btnX,
			y: this.btn1Y,
			width: this.btnW,
			height: this.btnH,
		})
		this.newGameButton.onEvent(goCreate)
		this.uiManager.addComponent(this.newGameButton)

		this.exitButton = new MenuButton(2, 'Salir', {
			theme: 'parchment',
			x: this.btnX,
			y: this.btn2Y,
			width: this.btnW,
			height: this.btnH,
		})
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
