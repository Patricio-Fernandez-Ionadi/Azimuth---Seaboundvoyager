import { fadeIn, fadeOut } from '../utils.js'

export class SceneManager {
	constructor(game) {
		this.game = game
		this.scenes = {}
		this.activeScene = null
		this.overlay = { opacity: 0 }
	}

	addScene(name, scene) {
		this.scenes[name] = scene
	}

	async changeScene(name, transition = true) {
		if (this.activeScene && transition) await fadeOut(this.overlay)

		// Cambiar a la nueva escena
		if (this.activeScene) this.activeScene.onExit?.()

		this.activeScene = this.scenes[name]
		if (this.activeScene) this.activeScene.onEnter?.()
		if (transition) await fadeIn(this.overlay)
	}

	update(deltaTime) {
		if (this.activeScene) {
			this.activeScene.update(deltaTime)
		}
	}

	render() {
		const { ctx } = this.game
		if (this.activeScene) this.activeScene.render()
		this.renderTransitionsOverlay(ctx)
	}

	setBackground(image) {
		const { ctx } = this.game
		// prettier-ignore
		ctx.drawImage(image,
			0, 0, image.width, image.height,
			0, 0, this.game.canvas.width, this.game.canvas.height
		)
	}

	renderTransitionsOverlay(ctx) {
		ctx.save()
		ctx.globalAlpha = this.overlay.opacity
		ctx.fillStyle = 'rgba(0, 0, 0, 1)'
		ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
		ctx.restore()
	}

	// handleZoom(e) {
	// 	if (this.activeScene && typeof this.activeScene.handleZoom === 'function') {
	// 		this.activeScene.handleZoom(e)
	// 	}
	// }
}
