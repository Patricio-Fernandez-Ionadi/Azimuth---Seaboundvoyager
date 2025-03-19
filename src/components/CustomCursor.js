export class CustomCursor {
	constructor(game) {
		this.game = game
		this.image = new Image()
		this.image.src = '/src/assets/ui/pirate-custom-cursor.png' // Ruta a tu imagen
		this.image.onload = () => (this.game.canvas.style.cursor = 'none')
		this.modelWidth = 326 // Ancho de cada modelo
		this.modelHeight = 326 // Altura de cada modelo
		this.currentModel = 'right' // Modelo inicial (derecha o izquierda)
		this.position = { x: 0, y: 0 } // Posición actual del cursor
		this.shadowRadius = 10 // Radio de la sombra circular
		this.shadowBlur = 10 // Intensidad del difuminado
		this.shadowColor = 'rgba(0, 0, 0, 0.5)' // Color de la sombra (negro con transparencia)

		this.game.canvas.addEventListener('mousedown', (e) => this.mouseDown(e))
		this.game.canvas.addEventListener('mouseup', (e) => this.mouseUp(e))
		this.game.canvas.addEventListener('mousemove', (e) => this.mouseMove(e))
	}

	/* Events */
	mouseDown(e) {
		this.button = e.button
		const mouseX = e.offsetX
		const mouseY = e.offsetY

		if (this.button === 0) {
			this.lastDownX = mouseX
			this.lastDownY = mouseY
		}

		const activeScene = this.game.sceneManager.activeScene
		if (activeScene) activeScene.mouseDown?.(mouseX, mouseY, e)

		this.game.player.mouseDown(mouseX, mouseY, e)
		this.setModel('left')
	}
	mouseUp(e) {
		const mouseX = e.offsetX
		const mouseY = e.offsetY

		const activeScene = this.game.sceneManager.activeScene
		if (activeScene) activeScene.mouseUp?.(mouseX, mouseY, e)

		this.game.player.mouseUp(mouseX, mouseY, e)
		this.setModel('right')
	}
	mouseMove(e) {
		const mouseX = e.offsetX
		const mouseY = e.offsetY
		const activeScene = this.game.sceneManager.activeScene
		if (activeScene) activeScene.mouseMove?.(mouseX, mouseY, e)

		this.position.x = mouseX
		this.position.y = mouseY
		this.game.player.mouseMove(mouseX, mouseY, e)
	}

	draw() {
		if (!this.image.complete) return // Esperar a que la imagen cargue

		// Dibujar la sombra circular
		this.game.ctx.save()
		this.game.ctx.beginPath()
		this.game.ctx.arc(
			this.position.x + 12, // Centro X del cursor
			this.position.y + 15, // Centro Y del cursor
			this.shadowRadius, // Radio de la sombra
			0,
			Math.PI * 2
		)
		this.game.ctx.fillStyle = this.shadowColor
		this.game.ctx.filter = `blur(${this.shadowBlur}px)` // Aplicar el desenfoque
		this.game.ctx.fill()
		this.game.ctx.restore()

		// Definir la región de recorte según el modelo actual
		const sx = this.currentModel === 'right' ? 0 : this.modelWidth
		const sy = 0
		const sw = this.modelWidth
		const sh = this.modelHeight

		// Dibujar el cursor en la posición actual
		this.game.ctx.drawImage(
			this.image,
			sx,
			sy,
			sw,
			sh, // Fuente (recorte de la imagen)
			this.position.x - 2,
			this.position.y, // Destino (posición en el canvas)
			30,
			30 // Escala
		)
	}

	setModel(model) {
		this.currentModel = model // 'right' o 'left'
	}
}
