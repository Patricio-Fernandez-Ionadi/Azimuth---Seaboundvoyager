import { Popup } from './Popup.js'

import { waitFor } from '../../../core/utils.js'

export class PopupManager {
	constructor(scene) {
		this.scene = scene
		this.uiManager = this.scene.uiManager
		this.eventSystem = this.scene.game.eventSystem

		// Escuchar el evento de clic en una zona
		this.eventSystem.on('zoneClicked', ({ x, y, zone }) => {
			this.createPopup(x, y, zone)
		})
	}

	createPopup(x, y, clickedZone) {
		if (this.scene.game.interactionState.isPopupOpen) return
		const popupWidth = 300
		const popupHeight = 270

		if (x + popupWidth > this.scene.game.canvas.width)
			x = this.scene.game.canvas.width - popupWidth
		if (y + popupHeight > this.scene.game.canvas.height)
			y = this.scene.game.canvas.height - popupHeight

		// Cerrar cualquier popup existente antes de crear uno nuevo
		this.uiManager.components.forEach((component) => {
			if (component instanceof Popup) {
				component.close()
			}
		})
		const popup = new Popup(
			x,
			y,
			popupWidth,
			popupHeight,
			'Información de la ciudad',
			clickedZone,
			1, // Prioridad alta,
			this.scene.game
		)
		popup.addButton('Cerrar', () => {
			this.uiManager.removeComponent(popup)
			popup.close()
			waitFor(10, () => (this.scene.game.interactionState.isPopupOpen = false))
		})
		popup.addButton('Seleccionar', () => {
			this.scene.game.interactionState.isPopupOpen = false
			this.eventSystem.emit('citySelected', clickedZone)
			popup.close()
		})

		// Marcar el estado de popup abierto
		this.scene.game.interactionState.isPopupOpen = true

		// Añadir el popup al UIManager
		this.uiManager.addComponent(popup)
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
