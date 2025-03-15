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
		// Convertir los componentes a un array ordenado por prioridad
		const sortedComponents = Array.from(this.components.values()).sort(
			(a, b) => b.priority - a.priority
		)
		for (const component of sortedComponents) {
			if (component.isPointInside(mouseX, mouseY)) {
				component.handleClick(mouseX, mouseY, e)
				return true // Detener la propagación
			}
		}
		return false
	}

	mouseDown() {}
	mouseUp() {}

	mouseMove(mouseX, mouseY, e) {
		const sortedComponents = Array.from(this.components.values()).sort(
			(a, b) => b.priority - a.priority
		)

		for (const component of sortedComponents) {
			if (component.mouseMove && component.isOpen) {
				if (component.mouseMove(mouseX, mouseY, e)) {
					return true
				}
			}
		}
		return false
	}

	renderComponents() {
		const { ctx } = this.game
		this.components.forEach((component) => component.draw(ctx))
	}
}
