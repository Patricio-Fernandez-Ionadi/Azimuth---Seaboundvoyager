export class Camera {
	constructor(game) {
		this.game = game
		this.x = 0
		this.y = 0
		this.canvasWidth = this.game.width || 0
		this.canvasHeight = this.game.height || 0
		this.target = null // El objetivo que la cámara sigue (por ejemplo, el jugador)
		this.mapWidth = Infinity // Ancho del mapa (por defecto infinito)
		this.mapHeight = Infinity // Altura del mapa (por defecto infinito)

		this.isDragging = false
		this.startX = 0
		this.startY = 0
		this.initialOffsetX = 0
		this.initialOffsetY = 0
	}

	setTarget(target) {
		this.target = target
	}
	setMapBounds(mapWidth, mapHeight) {
		this.mapWidth = mapWidth
		this.mapHeight = mapHeight
	}

	update() {
		if (this.target) {
			// Calcular la posición deseada de la cámara
			let desiredX =
				this.target.x - this.canvasWidth / 2 + this.target.width / 2
			let desiredY =
				this.target.y - this.canvasHeight / 2 + this.target.height / 2

			// Aplicar límites del mapa
			const minX = Math.min(0, this.mapWidth - this.canvasWidth)
			const minY = Math.min(0, this.mapHeight - this.canvasHeight)
			const maxX = Math.max(0, this.mapWidth - this.canvasWidth)
			const maxY = Math.max(0, this.mapHeight - this.canvasHeight)

			this.x = Math.max(minX, Math.min(desiredX, maxX))
			this.y = Math.max(minY, Math.min(desiredY, maxY))
		}
	}

	apply(ctx) {
		ctx.save()
		ctx.translate(-this.x, -this.y)
		ctx.scale(this.scale, this.scale)
	}

	restore(ctx) {
		ctx.restore()
	}

	mouseDown(mouseX, mouseY) {
		this.isDragging = true
		this.startX = mouseX
		this.startY = mouseY
		this.initialOffsetX = this.x
		this.initialOffsetY = this.y
	}

	handleDrag(mouseX, mouseY, e) {
		if (!this.isDragging) return

		// Calculamos el movimiento del mapa (drag)
		let newX = this.initialOffsetX + (mouseX - this.startX)
		let newY = this.initialOffsetY + (mouseY - this.startY)

		// Aplicar límites
		newX = Math.min(newX, 0) // Límite izquierdo
		newX = Math.max(newX, this.canvasWidth - this.mapWidth) // Límite derecho
		newY = Math.min(newY, 0) // Límite superior
		newY = Math.max(newY, this.canvasHeight - this.mapHeight) // Límite inferior

		this.x = newX
		this.y = newY
	}
	mouseUp(mouseX, mouseY, e) {
		this.isDragging = false
	}
}
