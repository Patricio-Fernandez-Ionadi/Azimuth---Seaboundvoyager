import { fontStyles } from '../core/fonts.js'
import { THEME } from './theme.js'
import { roundRect } from './internal/canvas.js'

/**
 * Panel
 * ----------------------------------------------------------------------
 * Caja con tema pergamino: sombra, fondo oscuro cálido, borde doble
 * (marrón externo + oro interno) y, opcionalmente, una pildora dorada
 * con título en la esquina superior izquierda.
 *
 * Pensada como primitive de UI: se posiciona y se dimensiona desde el
 * caller, y `draw()` devuelve el rectángulo interior (ya con padding y
 * excluyendo el área del título si lo hay) para que el contenido se
 * dibuje adentro sin recalcular.
 *
 * @example
 *   const panel = new Panel({ x: 20, y: 30, width: 400, height: 200, title: 'NPC' })
 *   const inner = panel.draw(ctx)
 *   // inner.x, inner.y, inner.width, inner.height
 *   ctx.fillText('hola', inner.x, inner.y + 20)
 */
export class Panel {
	/**
	 * @param {Object} opts
	 * @param {number} [opts.x=0]
	 * @param {number} [opts.y=0]
	 * @param {number} [opts.width=100]
	 * @param {number} [opts.height=100]
	 * @param {string} [opts.title=null]          Texto de la pildora (omitir para sin pildora).
	 * @param {number} [opts.titleHeight=28]      Alto de la pildora en px.
	 * @param {number} [opts.titleGap=10]         Separación entre pildora y contenido.
	 * @param {number} [opts.cornerRadius=6]       Radio de las 4 esquinas.
	 * @param {number} [opts.padding=18]           Padding del contenido.
	 * @param {boolean} [opts.showShadow=true]    Si dibujar la sombra suave.
	 * @param {boolean} [opts.showDoubleBorder=true] Si dibujar el segundo borde interno.
	 */
	constructor({
		x = 0,
		y = 0,
		width = 100,
		height = 100,
		title = null,
		titleHeight = 28,
		titleGap = 10,
		cornerRadius = 6,
		padding = 18,
		showShadow = true,
		showDoubleBorder = true,
	} = {}) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height
		this.title = title
		this.titleHeight = titleHeight
		this.titleGap = titleGap
		this.cornerRadius = cornerRadius
		this.padding = padding
		this.showShadow = showShadow
		this.showDoubleBorder = showDoubleBorder
	}

	/**
	 * Dibuja el panel y devuelve el rectángulo interior con padding y
	 * offset por título aplicados. Útil para que el caller dibuje el
	 * contenido sin recalcular.
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @returns {{x:number,y:number,width:number,height:number}}
	 */
	draw(ctx) {
		const r = this.cornerRadius
		const { x, y, width: w, height: h } = this

		ctx.save()

		/* Sombra suave */
		if (this.showShadow) {
			ctx.fillStyle = THEME.shadow
			roundRect(ctx, x + 3, y + 5, w, h, r)
			ctx.fill()
		}

		/* Fondo del pergamino */
		ctx.fillStyle = THEME.bg
		roundRect(ctx, x, y, w, h, r)
		ctx.fill()

		/* Borde externo (marrón oscuro) */
		ctx.lineJoin = 'round'
		ctx.strokeStyle = THEME.borderOuter
		ctx.lineWidth = 2
		roundRect(ctx, x, y, w, h, r)
		ctx.stroke()

		/* Borde interno (oro), opcional */
		if (this.showDoubleBorder) {
			ctx.strokeStyle = THEME.borderInner
			ctx.lineWidth = 1
			roundRect(ctx, x + 4, y + 4, w - 8, h - 8, Math.max(2, r - 2))
			ctx.stroke()
		}

		/* Pildora de título */
		let titleReserveH = 0
		if (this.title) {
			const tH = this.titleHeight
			const maxTitleW = w - this.padding * 2
			ctx.font = `bold 16px ${fontStyles.body.name}, Arial, sans-serif`
			const titleW = Math.min(
				ctx.measureText(this.title).width + 24,
				maxTitleW,
			)

			// Sombra de la pildora
			ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
			roundRect(ctx, x + 1, y + 2, titleW, tH, 4)
			ctx.fill()

			// Pildora con gradiente dorado
			const grad = ctx.createLinearGradient(x, y, x, y + tH)
			grad.addColorStop(0, THEME.nameGradientTop)
			grad.addColorStop(1, THEME.nameGradientBottom)
			ctx.fillStyle = grad
			roundRect(ctx, x, y, titleW, tH, 4)
			ctx.fill()

			// Texto del título
			ctx.fillStyle = THEME.nameFg
			ctx.textBaseline = 'middle'
			ctx.textAlign = 'left'
			ctx.fillText(this.title, x + 12, y + tH / 2 + 1)
			ctx.textBaseline = 'alphabetic'

			titleReserveH = tH + this.titleGap
		}

		ctx.restore()

		/* Rectángulo interior: padding + alto reservado por el título */
		return {
			x: x + this.padding,
			y: y + this.padding + titleReserveH,
			width: w - this.padding * 2,
			height: h - this.padding * 2 - titleReserveH,
		}
	}
}
