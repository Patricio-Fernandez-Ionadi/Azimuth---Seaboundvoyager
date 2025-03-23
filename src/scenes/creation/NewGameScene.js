import { UIManager } from '../../core/managers/UIManager.js'
import { MenuButton } from '../../components/MenuButton.js'

import { SCENES } from '../../core/constants.js'
import { loadImage } from '../../core/utils.js'

const BG_IMG = '/src/scenes/creation/assets/background.jpg'

export class NewGameScene {
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
		const { ctx } = this.game

		if (this.loaded) {
			this.game.sceneManager.setBackground(this.bg)
			this.uiManager.renderComponents()
		} else {
			// black screen
			ctx.fillStyle = 'black'
			ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height)
		}
	}

	/* Load/Unload */
	onEnter() {
		const goValeris = () =>
			this.game.sceneManager.changeScene(SCENES.city.valeris.scene)
		const goMenu = () => this.game.sceneManager.changeScene(SCENES.menu)

		this.initGame_button = new MenuButton(1, 'Comenzar')
		this.initGame_button.onEvent(goValeris)
		this.uiManager.addComponent(this.initGame_button)

		this.back_button = new MenuButton(2, 'Menu')
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
