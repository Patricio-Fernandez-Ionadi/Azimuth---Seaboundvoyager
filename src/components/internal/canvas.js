/**
 * Helpers de canvas compartidos por los componentes temáticos.
 * Mantener acá evita duplicar `#roundRect` en cada componente.
 */

/**
 * Construye un path de rectángulo con esquinas redondeadas en el
 * contexto. NO llama a fill ni a stroke; deja el path listo para que
 * el caller pinte.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @param {number|number[]} r  Radio (número) o [tl, tr, br, bl].
 */
export function roundRect(ctx, x, y, w, h, r) {
	const rr = typeof r === 'number' ? [r, r, r, r] : r
	ctx.beginPath()
	ctx.moveTo(x + rr[0], y)
	ctx.lineTo(x + w - rr[1], y)
	ctx.arcTo(x + w, y, x + w, y + rr[1], rr[1])
	ctx.lineTo(x + w, y + h - rr[2])
	ctx.arcTo(x + w, y + h, x + w - rr[2], y + h, rr[2])
	ctx.lineTo(x + rr[3], y + h)
	ctx.arcTo(x, y + h, x, y + h - rr[3], rr[3])
	ctx.lineTo(x, y + rr[0])
	ctx.arcTo(x, y, x + rr[0], y, rr[0])
	ctx.closePath()
}
