/**
 * THEME
 * ----------------------------------------------------------------------
 * Paleta compartida por los componentes UI temáticos (Panel, Tooltip,
 * Tabs, MenuButton con `theme: 'parchment'`, DialogManager).
 *
 * Mantener un solo lugar para los colores asegura coherencia visual
 * entre el diálogo, el menú, los popups del mapa, etc.
 *
 * Para ajustar el look del juego, modificá los valores acá y se
 * propagará a todos los componentes que importen THEME.
 */
export const THEME = {
	/* Caja */
	bg: 'rgba(22, 16, 8, 0.94)',
	bgSolid: 'rgba(22, 16, 8, 1)',
	shadow: 'rgba(0, 0, 0, 0.55)',
	borderOuter: '#5a3a1a',
	borderInner: '#d4a548',
	borderHighlight: '#ffd700',

	/* Píldora de título */
	nameGradientTop: '#e8b85a',
	nameGradientBottom: '#b8881e',
	nameFg: '#1a0e05',

	/* Texto */
	text: '#f4e4c1',
	textShadow: 'rgba(0, 0, 0, 0.8)',
	textDim: '#c9b896',
	textHint: '#8a7d5e',
	textKey: '#d4a548',

	/* Estado */
	divider: 'rgba(212, 165, 72, 0.45)',
	selected: '#ffd700',
	selectedBg: 'rgba(212, 165, 72, 0.18)',
	hoverBg: 'rgba(212, 165, 72, 0.08)',

	/* Tabs */
	tabActiveBg: 'rgba(212, 165, 72, 0.32)',
	tabIdleBg: 'rgba(40, 28, 14, 0.55)',

	/* Botones con tema pergamino */
	buttonIdleBg: 'rgba(40, 28, 14, 0.6)',
	buttonHoverBg: 'rgba(212, 165, 72, 0.28)',
}
