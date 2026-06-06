import { Button } from './Button.js'
import { THEME } from './theme.js'
import { fontStyles } from '../core/fonts.js'
import { roundRect } from './internal/canvas.js'

/**
 * MenuButton
 * ----------------------------------------------------------------------
 * Botón para menús de escena. Por defecto delega a `Button` (sprite).
 * Si se pasa `theme: 'parchment'`, se dibuja en canvas con la paleta
 * del juego (fondo beige, borde dorado, hover más claro) para que
 * combine con `Panel`.
 *
 * Backward compatible: `new MenuButton(idx, label)` sigue funcionando.
 */
export class MenuButton {
	constructor(idx, lb, opts = {}) {
		this.label = lb || ''
		this.index = idx || 0
		this.theme = opts.theme ?? null

		/* Geometría (relevante sólo en modo themed) */
		this.fz = opts.fontSize ?? 24
		this.width = opts.width ?? 300
		this.height = opts.height ?? 50
		this.startY = opts.startY ?? 50
		this.padding = opts.padding ?? [20, 35]

		/* Posición: opts gana; si no, cálculo index-based */
		const baseY =
			this.index > 1 ? this.startY * this.index + 20 : this.startY * this.index
		this.x = opts.x ?? 440
		this.y = opts.y ?? baseY

		/* Estado hover (sólo en modo themed) */
		this.hovered = false
		this.onClick = null

		/* Modo sprite (compatibilidad con el viejo `Button`) */
		if (this.theme === null) {
			this.button = new Button(
				this.x,
				baseY,
				this.width,
				this.height,
				this.label,
				this.fz,
				this.padding[0],
				this.padding[1]
			)
		}
	}

	/* ============================================================
	 * Render
	 * ============================================================ */

	draw(ctx) {
		if (this.theme === 'parchment') {
			this.#drawParchment(ctx)
		} else {
			this.button.draw(ctx)
		}
	}

	#drawParchment(ctx) {
		ctx.save()

		/* Sombra suave */
		ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'
		ctx.shadowBlur = 6
		ctx.shadowOffsetX = 0
		ctx.shadowOffsetY = 2

		/* Fondo */
		ctx.fillStyle = this.hovered ? THEME.buttonHoverBg : THEME.buttonIdleBg
		roundRect(ctx, this.x, this.y, this.width, this.height, 6)
		ctx.fill()

		/* Reset shadow */
		ctx.shadowColor = 'transparent'
		ctx.shadowBlur = 0
		ctx.shadowOffsetY = 0

		/* Borde dorado interno */
		ctx.strokeStyle = THEME.borderInner
		ctx.lineWidth = 2
		roundRect(ctx, this.x + 1, this.y + 1, this.width - 2, this.height - 2, 5)
		ctx.stroke()

		/* Texto */
		ctx.fillStyle = THEME.text
		ctx.font = `bold ${this.fz}px ${fontStyles.body.name}, Arial, sans-serif`
		ctx.textAlign = 'center'
		ctx.textBaseline = 'middle'
		ctx.fillText(
			this.label,
			this.x + this.width / 2,
			this.y + this.height / 2
		)

		ctx.textAlign = 'left'
		ctx.textBaseline = 'alphabetic'
		ctx.restore()
	}

	/* ============================================================
	 * Eventos
	 * ============================================================ */

	mouseMove(mouseX, mouseY) {
		if (this.theme === 'parchment') {
			this.hovered = this.#isInside(mouseX, mouseY)
		} else {
			this.button.handleHover(mouseX, mouseY)
		}
	}

	onEvent(cb) {
		if (this.theme === 'parchment') {
			this.onClick = () => cb()
		} else {
			this.button.onClick = () => cb()
		}
	}

	handleClick(mouseX, mouseY, e) {
		if (this.theme === 'parchment') {
			if (this.#isInside(mouseX, mouseY) && this.onClick) {
				this.onClick()
			}
		} else {
			this.button.handleClick(mouseX, mouseY, e)
		}
	}

	#isInside(mx, my) {
		return (
			mx >= this.x &&
			mx <= this.x + this.width &&
			my >= this.y &&
			my <= this.y + this.height
		)
	}
}
