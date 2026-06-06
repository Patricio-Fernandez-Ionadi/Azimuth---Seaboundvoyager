import { UIManager } from '../../core/managers/UIManager.js'
import { MenuButton } from '../../components/MenuButton.js'
import { Panel } from '../../components/Panel.js'

import { SCENES } from '../../core/constants.js'
import { loadImage } from '../../core/utils.js'

const BG_IMG = '/src/scenes/creation/assets/background.jpg'

export class NewGameScene {
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
				title: 'Nueva Partida',
			}).draw(ctx)
			this.uiManager.renderComponents()
		} else {
			/* black screen */
			ctx.fillStyle = 'black'
			ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height)
		}
	}

	/* Load/Unload */
	onEnter() {
		const goValeris = () =>
			this.game.sceneManager.changeScene(SCENES.city.valeris.scene)
		const goMenu = () => this.game.sceneManager.changeScene(SCENES.menu)

		this.initGame_button = new MenuButton(1, 'Comenzar', {
			theme: 'parchment',
			x: this.btnX,
			y: this.btn1Y,
			width: this.btnW,
			height: this.btnH,
		})
		this.initGame_button.onEvent(goValeris)
		this.uiManager.addComponent(this.initGame_button)

		this.back_button = new MenuButton(2, 'Menu', {
			theme: 'parchment',
			x: this.btnX,
			y: this.btn2Y,
			width: this.btnW,
			height: this.btnH,
		})
		this.back_button.onEvent(goMenu)
		this.uiManager.addComponent(this.back_button)
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
