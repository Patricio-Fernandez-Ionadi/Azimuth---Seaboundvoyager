import { fontStyles } from '../core/fonts.js'
import { THEME } from './theme.js'
import { roundRect } from './internal/canvas.js'

/**
 * Tooltip
 * ----------------------------------------------------------------------
 * Caja compacta con una o varias líneas de texto, con tema pergamino
 * consistente. Se auto-posiciona para no salirse del viewport.
 *
 * Pensado para descripciones de items, hints, info de NPC, etc.
 *
 * @example
 *   const t = new Tooltip({
 *     x: 100, y: 50,
 *     align: 'top-left',
 *     viewport: { width: 768, height: 432 },
 *     lines: [
 *       { label: 'Espada', size: 14, color: THEME.selected, weight: 'bold' },
 *       { label: 'Hoja de acero', size: 12, color: THEME.textDim },
 *     ],
 *   })
 *   t.draw(ctx)
 */
export class Tooltip {
	/**
	 * @param {Object} opts
	 * @param {number} [opts.x=0]            Ancla X (interpretado según `align`).
	 * @param {number} [opts.y=0]            Ancla Y (interpretado según `align`).
	 * @param {Array}  [opts.lines=[]]       `[{ label, size?, color?, weight? }, ...]`.
	 * @param {string} [opts.align='top-left'] 'top-left'|'top-right'|'bottom-left'|'bottom-right'.
	 *                                       'top-left' = la esquina superior-izquierda del
	 *                                       tooltip queda en (x, y).
	 * @param {{width:number,height:number}} [opts.viewport=null] Viewport para el clamp.
	 *                                       Si se omite, se intenta leer de ctx.canvas.
	 * @param {number} [opts.minWidth=0]     Ancho mínimo del tooltip.
	 * @param {number} [opts.maxWidth=320]   Ancho máximo (clamp antes de medir texto).
	 * @param {number} [opts.padding=10]      Padding interno.
	 * @param {number} [opts.lineGap=3]      Separación entre líneas.
	 * @param {number} [opts.margin=8]       Margen contra los bordes del viewport.
	 * @param {number} [opts.cornerRadius=4] Radio de las esquinas.
	 * @param {number} [opts.defaultSize=14] Tamaño por defecto de las líneas sin `size`.
	 */
	constructor({
		x = 0,
		y = 0,
		lines = [],
		align = 'top-left',
		viewport = null,
		minWidth = 0,
		maxWidth = 320,
		padding = 10,
		lineGap = 3,
		margin = 8,
		cornerRadius = 4,
		defaultSize = 14,
	} = {}) {
		this.x = x
		this.y = y
		this.lines = lines
		this.align = align
		this.viewport = viewport
		this.minWidth = minWidth
		this.maxWidth = maxWidth
		this.padding = padding
		this.lineGap = lineGap
		this.margin = margin
		this.cornerRadius = cornerRadius
		this.defaultSize = defaultSize
	}

	/**
	 * Mide y dibuja el tooltip. Auto-clampa al viewport. Devuelve el
	 * rectángulo final dibujado o `null` si no había líneas.
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @returns {{x:number,y:number,width:number,height:number}|null}
	 */
	draw(ctx) {
		if (!this.lines || this.lines.length === 0) return null

		/* --- 1. Medir cada línea --- */
		const measured = this.lines.map((line) => {
			const size = line.size ?? this.defaultSize
			const weight = line.weight ? `${line.weight} ` : ''
			ctx.font = `${weight}${size}px ${fontStyles.body.name}, Arial, sans-serif`
			const m = ctx.measureText(line.label)
			return { ...line, size, width: m.width }
		})

		/* --- 2. Calcular dimensiones --- */
		const widestLine = Math.max(...measured.map((l) => l.width))
		const contentW = Math.max(
			this.minWidth,
			Math.min(this.maxWidth, widestLine + this.padding * 2),
		)
		const contentH =
			measured.reduce((acc, l) => acc + l.size + this.lineGap, 0) -
			this.lineGap +
			this.padding * 2

		/* --- 3. Posicionar según `align` --- */
		const vp =
			this.viewport ??
			(ctx.canvas
				? { width: ctx.canvas.width, height: ctx.canvas.height }
				: { width: 768, height: 432 })

		let drawX = this.x
		let drawY = this.y
		if (this.align.includes('right')) drawX -= contentW
		if (this.align.includes('bottom')) drawY -= contentH

		/* --- 4. Clamp al viewport --- */
		if (drawX + contentW > vp.width - this.margin) {
			drawX = vp.width - contentW - this.margin
		}
		if (drawX < this.margin) drawX = this.margin
		if (drawY + contentH > vp.height - this.margin) {
			drawY = vp.height - contentH - this.margin
		}
		if (drawY < this.margin) drawY = this.margin

		/* --- 5. Dibujar fondo + borde --- */
		ctx.save()
		ctx.fillStyle = THEME.bg
		roundRect(ctx, drawX, drawY, contentW, contentH, this.cornerRadius)
		ctx.fill()

		ctx.strokeStyle = THEME.borderInner
		ctx.lineWidth = 1.5
		roundRect(ctx, drawX, drawY, contentW, contentH, this.cornerRadius)
		ctx.stroke()

		/* --- 6. Dibujar líneas --- */
		ctx.textAlign = 'left'
		ctx.textBaseline = 'alphabetic'
		let curY = drawY + this.padding + measured[0].size
		for (const line of measured) {
			const weight = line.weight ? `${line.weight} ` : ''
			ctx.font = `${weight}${line.size}px ${fontStyles.body.name}, Arial, sans-serif`
			ctx.fillStyle = line.color ?? THEME.text
			ctx.fillText(line.label, drawX + this.padding, curY)
			curY += line.size + this.lineGap
		}
		ctx.restore()

		return { x: drawX, y: drawY, width: contentW, height: contentH }
	}
}
