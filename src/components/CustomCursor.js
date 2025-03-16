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
	}

	draw(ctx) {
		if (!this.image.complete) return // Esperar a que la imagen cargue

		// Dibujar la sombra circular
		ctx.save()
		ctx.beginPath()
		ctx.arc(
			this.position.x + 12, // Centro X del cursor
			this.position.y + 15, // Centro Y del cursor
			this.shadowRadius, // Radio de la sombra
			0,
			Math.PI * 2
		)
		ctx.fillStyle = this.shadowColor
		ctx.filter = `blur(${this.shadowBlur}px)` // Aplicar el desenfoque
		ctx.fill()
		ctx.restore()

		// Definir la región de recorte según el modelo actual
		const sx = this.currentModel === 'right' ? 0 : this.modelWidth
		const sy = 0
		const sw = this.modelWidth
		const sh = this.modelHeight

		// Dibujar el cursor en la posición actual
		ctx.drawImage(
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

	updatePosition(x, y) {
		this.position.x = x
		this.position.y = y
	}

	setModel(model) {
		this.currentModel = model // 'right' o 'left'
	}
}
