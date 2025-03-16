export class UIManager {
	constructor(game) {
		this.game = game
		this.eventSystem = this.game.eventSystem
		this.components = new Map()
		this.nextId = 0 // Contador incremental
	}

	addComponent(component) {
		const id = this.nextId++
		component.id = id
		this.components.set(id, component)
	}

	removeComponent(component) {
		this.components.delete(component.id)
	}

	setCustomCursor(cursor) {
		this.customCursor = cursor // Asignar el cursor personalizado
	}

	handleClick(mouseX, mouseY, e) {
		this.components.forEach((component) => {
			if (component.handleClick) component.handleClick(mouseX, mouseY, e)
		})
	}

	mouseDown(mouseX, mouseY, e) {
		this.components.forEach((component) => {
			if (component.mouseDown) component.mouseDown(mouseX, mouseY, e)
		})
	}
	mouseUp(mouseX, mouseY, e) {
		this.components.forEach((component) => {
			if (component.mouseUp) component.mouseUp(mouseX, mouseY, e)
		})
	}

	mouseMove(mouseX, mouseY, e) {
		this.components.forEach((component) => {
			if (component.mouseMove) component.mouseMove(mouseX, mouseY, e)
		})
	}

	renderComponents() {
		const { ctx } = this.game
		this.components.forEach((component) => {
			/* para componentes con propiedad isOpen, chequear si debe ser renderizado segun su flag */
			if (typeof component.isOpen !== 'undefined') {
				if (component.isOpen) {
					component.draw(ctx)
				}
			}

			/* componentes sin flag isOpen renderizar siempre */
			if (typeof component.isOpen === 'undefined') {
				component.draw(ctx)
			}
		})
	}
}
