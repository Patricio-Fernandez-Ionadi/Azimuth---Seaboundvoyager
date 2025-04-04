import { Popup } from './Popup.js'

import { waitFor } from '../../../core/utils.js'

export class PopupManager {
	constructor(scene) {
		this.scene = scene
		this.uiManager = this.scene.uiManager
		this.eventSystem = this.scene.game.eventSystem
		this.isPopupOpen = false

		// Escuchar el evento de clic en una zona
		this.eventSystem.on('zoneClicked', ({ x, y, zone }) => {
			this.createPopup(x, y, zone)
		})
	}

	createPopup(x, y, clickedZone) {
		if (this.isPopupOpen) return
		// Cerrar cualquier popup existente antes de crear uno nuevo
		this.clearPopups()

		const popupWidth = 300
		const popupHeight = 270

		if (x + popupWidth > this.scene.game.canvas.width)
			x = this.scene.game.canvas.width - popupWidth
		if (y + popupHeight > this.scene.game.canvas.height)
			y = this.scene.game.canvas.height - popupHeight

		const popup = new Popup(
			x,
			y,
			'Información de la ciudad',
			clickedZone,
			this.scene.game
		)
		popup.addButton('Cerrar', () => {
			this.uiManager.removeComponent(popup)
			popup.close()
			waitFor(10, () => (this.isPopupOpen = false))
		})
		popup.addButton('Seleccionar', () => {
			this.isPopupOpen = false
			this.eventSystem.emit('citySelected', clickedZone)
			popup.close()
		})

		// Marcar el estado de popup abierto
		this.isPopupOpen = true

		// Añadir el popup al UIManager
		this.uiManager.addComponent(popup)
	}

	clearPopups() {
		this.uiManager.components.forEach((component) => {
			if (component instanceof Popup) {
				component.close()
			}
		})
	}

	handleClick(mouseX, mouseY) {
		for (let popup of this.popups) {
			if (popup.isPointInside(mouseX, mouseY)) {
				popup.handleClick(mouseX, mouseY)
				return true
			}
		}
		return false
	}

	renderPopups(ctx) {
		this.popups.forEach((popup) => popup.draw(ctx))
	}
}
