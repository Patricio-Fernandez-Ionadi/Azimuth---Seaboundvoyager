import { THEME } from './theme.js'

/**
 * ScrollableArea
 * ----------------------------------------------------------------------
 * Área con scroll vertical. Aplica clip + translate al contenido, deja
 * una columna de 8px a la derecha para la scrollbar, y dibuja la
 * scrollbar themed cuando hace falta.
 *
 * Pensado para envolver el contenido de un tab: el caller pasa un
 * callback `drawContent` que dibuja todo el contenido en coordenadas
 * locales (con y=0 en el tope del contenido). El scroll se hace restando
 * `scrollY` internamente, así el caller no tiene que pensarlo.
 *
 * Si el contenido entra en el viewport, no se muestra la scrollbar y
 * se usa el ancho completo (sin recortar los 8px).
 *
 * @example
 *   const area = new ScrollableArea({
 *     x, y, width, height, contentHeight: items.length * rowHeight
 *   })
 *   area.draw(ctx, (ctx, ox, oy, ow, oh) => {
 *     items.forEach((it, i) => it.draw(ctx, ox, oy + i * rowHeight, ow, rowHeight))
 *   })
 *   area.handleWheel(deltaY)
 */
export class ScrollableArea {
	/**
	 * @param {Object} opts
	 * @param {number} opts.x
	 * @param {number} opts.y
	 * @param {number} opts.width
	 * @param {number} opts.height       Alto del viewport visible.
	 * @param {number} opts.contentHeight Alto total del contenido (puede ser > height).
	 */
	constructor({ x, y, width, height, contentHeight }) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height
		this.contentHeight = Math.max(0, contentHeight)
		this.scrollY = 0
		this._draggingThumb = false
		this._dragOffsetY = 0
	}

	/* ============================================================
	 * Getters de estado
	 * ============================================================ */

	get maxScroll() {
		return Math.max(0, this.contentHeight - this.height)
	}

	get canScroll() {
		return this.maxScroll > 0
	}

	/** Ancho utilizable por el contenido (sin scrollbar). */
	get contentWidth() {
		return this.canScroll ? this.width - 8 : this.width
	}

	/* ============================================================
	 * Mutadores de scroll
	 * ============================================================ */

	scrollBy(dy) {
		this.scrollY = Math.max(0, Math.min(this.maxScroll, this.scrollY + dy))
	}

	scrollTo(y) {
		this.scrollY = Math.max(0, Math.min(this.maxScroll, y))
	}

	reset() {
		this.scrollY = 0
	}

	/* ============================================================
	 * Render
	 * ============================================================ */

	/**
	 * Dibuja el contenido. `drawContent(ctx, cx, cy, cw, ch)` se invoca
	 * con un contexto ya clipeado y trasladado: `cy` corresponde al
	 * tope del viewport (no del contenido) si no hay scroll, o el
	 * equivalente desplazado si hay.
	 *
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {(ctx:CanvasRenderingContext2D,cx:number,cy:number,cw:number,ch:number)=>void} drawContent
	 */
	draw(ctx, drawContent) {
		const contentW = this.contentWidth

		ctx.save()
		ctx.beginPath()
		ctx.rect(this.x, this.y, contentW, this.height)
		ctx.clip()

		if (this.canScroll) {
			ctx.translate(0, -this.scrollY)
			/* cy = this.y + this.scrollY para que la línea 0 del contenido
			 * caiga a esta altura visual. */
			drawContent(ctx, this.x, this.y + this.scrollY, contentW, this.contentHeight)
		} else {
			drawContent(ctx, this.x, this.y, contentW, this.height)
		}

		ctx.restore()

		if (this.canScroll) this.#drawScrollbar(ctx)
	}

	#drawScrollbar(ctx) {
		const trackX = this.x + this.width - 6
		const trackY = this.y
		const trackH = this.height

		const ratio = this.height / this.contentHeight
		const thumbH = Math.max(24, ratio * trackH)
		const usableTrack = trackH - thumbH
		const thumbY = trackY + (this.maxScroll > 0 ? (this.scrollY / this.maxScroll) * usableTrack : 0)

		/* Track */
		ctx.fillStyle = 'rgba(0, 0, 0, 0.30)'
		ctx.fillRect(trackX, trackY, 5, trackH)

		/* Thumb */
		ctx.fillStyle = this._draggingThumb ? THEME.selected : THEME.borderInner
		ctx.fillRect(trackX + 1, thumbY, 3, thumbH)
	}

	/* ============================================================
	 * Input: rueda y drag de la scrollbar
	 * ============================================================ */

	handleWheel(deltaY) {
		if (!this.canScroll) return
		this.scrollBy(deltaY)
	}

	/** ¿El click cayó sobre la scrollbar? Devuelve true si lo absorbe. */
	handleMouseDown(mx, my) {
		if (!this.canScroll) return false
		if (this.#isOnThumb(mx, my)) {
			this._draggingThumb = true
			this._dragOffsetY = my - this.#thumbY()
			return true
		}
		if (this.#isOnTrack(mx, my)) {
			/* Click en el track: centrar la thumb donde se clickeó. */
			const thumbH = this.#thumbHeight()
			this.scrollTo(((my - this.y - thumbH / 2) / (this.height - thumbH)) * this.maxScroll)
			/* Y empezar a draggear desde el medio de la thumb. */
			this._draggingThumb = true
			this._dragOffsetY = thumbH / 2
			return true
		}
		return false
	}

	handleMouseMove(mx, my) {
		if (!this._draggingThumb) return false
		const thumbH = this.#thumbHeight()
		const usableTrack = this.height - thumbH
		if (usableTrack <= 0) return true
		const targetThumbY = my - this._dragOffsetY
		const ratio = (targetThumbY - this.y) / usableTrack
		this.scrollTo(ratio * this.maxScroll)
		return true
	}

	handleMouseUp() {
		if (!this._draggingThumb) return false
		this._draggingThumb = false
		return true
	}

	/* ============================================================
	 * Helpers privados de la scrollbar
	 * ============================================================ */

	#thumbHeight() {
		return Math.max(24, (this.height / this.contentHeight) * this.height)
	}

	#thumbY() {
		const thumbH = this.#thumbHeight()
		const usableTrack = this.height - thumbH
		if (usableTrack <= 0) return this.y
		return this.y + (this.maxScroll > 0 ? (this.scrollY / this.maxScroll) * usableTrack : 0)
	}

	#isOnThumb(mx, my) {
		const thumbH = this.#thumbHeight()
		const ty = this.#thumbY()
		return (
			mx >= this.x + this.width - 6 &&
			mx <= this.x + this.width - 1 &&
			my >= ty &&
			my <= ty + thumbH
		)
	}

	#isOnTrack(mx, my) {
		return (
			mx >= this.x + this.width - 8 &&
			mx <= this.x + this.width &&
			my >= this.y &&
			my <= this.y + this.height
		)
	}
}
