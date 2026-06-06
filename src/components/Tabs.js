import { fontStyles } from '../core/fonts.js'
import { THEME } from './theme.js'

/**
 * Tabs
 * ----------------------------------------------------------------------
 * Tira horizontal de pestañas con tema pergamino. La tab activa se
 * resalta en oro, las inactivas en tono oscuro, y la tab en hover
 * recibe un brillo sutil.
 *
 * Pensado para el MenuGame (Inventario/Crear/Stats/Misiones/Logros) y
 * cualquier otra navegación por tabs.
 *
 * @example
 *   const tabs = new Tabs({
 *     x: 0, y: 0, width: 700, height: 36,
 *     tabs: ['Uno', 'Dos', 'Tres'],
 *     selected: 0,
 *     onSelect: (i) => { this.selectedTab = this.tabs.tabs[i] },
 *   })
 *   tabs.draw(ctx)
 *   // en mouseDown: const i = tabs.handleClick(mx, my)
 */
export class Tabs {
	/**
	 * @param {Object} opts
	 * @param {number} [opts.x=0]
	 * @param {number} [opts.y=0]
	 * @param {number} [opts.width=0]
	 * @param {number} [opts.height=36]
	 * @param {string[]} [opts.tabs=[]]
	 * @param {number}   [opts.selected=0]
	 * @param {(i:number)=>void} [opts.onSelect=null]
	 * @param {number}   [opts.fontSize=16]
	 * @param {number}   [opts.cornerRadius=4] Radio solo de las esquinas superiores.
	 */
	constructor({
		x = 0,
		y = 0,
		width = 0,
		height = 36,
		tabs = [],
		selected = 0,
		onSelect = null,
		fontSize = 16,
		cornerRadius = 4,
	} = {}) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height
		this.tabs = tabs
		this.selected = selected
		this.onSelect = onSelect
		this.fontSize = fontSize
		this.cornerRadius = cornerRadius
		this.hovered = -1
	}

	setSelected(idx) {
		if (idx < 0 || idx >= this.tabs.length) return
		this.selected = idx
		if (this.onSelect) this.onSelect(idx)
	}

	getTabWidth() {
		return this.width / Math.max(1, this.tabs.length)
	}

	draw(ctx) {
		if (this.tabs.length === 0 || this.width === 0) return
		const tabW = this.getTabWidth()
		const font = `bold ${this.fontSize}px ${fontStyles.body.name}, Arial, sans-serif`
		ctx.font = font

		/* Fondo base del strip (un solo rectángulo para evitar parpadeos) */
		ctx.fillStyle = THEME.tabIdleBg
		ctx.fillRect(this.x, this.y, this.width, this.height)

		for (let i = 0; i < this.tabs.length; i++) {
			const tx = this.x + tabW * i

			/* Highlight de hover/active */
			if (i === this.selected) {
				ctx.fillStyle = THEME.tabActiveBg
				ctx.fillRect(tx, this.y, tabW, this.height)
			} else if (i === this.hovered) {
				ctx.fillStyle = THEME.hoverBg
				ctx.fillRect(tx, this.y, tabW, this.height)
			}

			/* Separador vertical entre tabs */
			if (i > 0) {
				ctx.strokeStyle = THEME.divider
				ctx.lineWidth = 1
				ctx.beginPath()
				ctx.moveTo(tx + 0.5, this.y + 4)
				ctx.lineTo(tx + 0.5, this.y + this.height - 4)
				ctx.stroke()
			}

			/* Indicador de activo: línea inferior dorada */
			if (i === this.selected) {
				ctx.fillStyle = THEME.selected
				ctx.fillRect(tx + 4, this.y + this.height - 2, tabW - 8, 2)
			}

			/* Label */
			ctx.fillStyle = i === this.selected ? THEME.selected : THEME.textDim
			ctx.textAlign = 'center'
			ctx.textBaseline = 'middle'
			ctx.fillText(this.tabs[i], tx + tabW / 2, this.y + this.height / 2)
		}
		ctx.textAlign = 'left'
		ctx.textBaseline = 'alphabetic'
	}

	/**
	 * Maneja el click: si el punto está dentro del strip, cambia la
	 * tab seleccionada (y dispara onSelect). Devuelve el índice o -1.
	 */
	handleClick(mouseX, mouseY) {
		const idx = this.getIndexAt(mouseX, mouseY)
		if (idx < 0) return -1
		this.setSelected(idx)
		return idx
	}

	/**
	 * Actualiza el índice hovered. Llamar en mouseMove.
	 * Devuelve true si el mouse está sobre el strip.
	 */
	handleHover(mouseX, mouseY) {
		const idx = this.getIndexAt(mouseX, mouseY)
		this.hovered = idx
		return idx >= 0
	}

	getIndexAt(mouseX, mouseY) {
		if (this.tabs.length === 0) return -1
		if (mouseX < this.x || mouseX > this.x + this.width) return -1
		if (mouseY < this.y || mouseY > this.y + this.height) return -1
		const idx = Math.floor((mouseX - this.x) / this.getTabWidth())
		return idx >= 0 && idx < this.tabs.length ? idx : -1
	}
}
