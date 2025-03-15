export class Button {
	constructor(x, y, width, height, label, fz = 24, lx = 0, ly = 0) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height
		this.label = label
		this.labelX = lx
		this.labelY = ly
		this.fontSize = fz
		this.isHovered = false

		// Cargar imágenes para los botones
		this.bar0Img = new Image()
		this.bar0Img.src = '/src/components/assets/Bar_0.png'
		this.bar1Img = new Image()
		this.bar1Img.src = '/src/components/assets/Bar_1.png'
	}

	isPointInside(mouseX, mouseY) {
		return (
			mouseX >= this.x &&
			mouseX <= this.x + this.width &&
			mouseY >= this.y &&
			mouseY <= this.y + this.height
		)
	}

	handleHover(mouseX, mouseY) {
		this.isHovered = this.isPointInside(mouseX, mouseY)
	}

	handleClick(mouseX, mouseY, e) {
		if (
			this.isPointInside(mouseX, mouseY) &&
			typeof this.onClick === 'function'
		) {
			this.onClick(e)
			return true
		}
		return false
	}

	draw(ctx) {
		ctx.save()

		// Dibujar la imagen del botón según si está siendo hovereado
		const img = this.isHovered ? this.bar1Img : this.bar0Img

		ctx.drawImage(
			img,
			0,
			0,
			img.width,
			img.height,
			this.x,
			this.y,
			this.width,
			this.height
		)

		// Dibujar el texto del botón
		ctx.fillStyle = this.isHovered ? 'white' : '#aaa'
		ctx.font = `${this.fontSize}px Arial`
		ctx.fillText(this.label, this.x + this.labelX, this.y + this.labelY)

		ctx.restore()
	}
}
