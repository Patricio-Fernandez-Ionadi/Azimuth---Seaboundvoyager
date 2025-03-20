import { Text } from '../components/Text.js'

export const Debugger = ({ ctx, label, game }) => {
	const marginBottom = 50
	const height = 30
	const width = 150
	const x = 5
	const y = game.height - marginBottom - height
	ctx.fillStyle = '#ff000044'
	ctx.fillRect(x, y, width, height)
	Text({
		ctx,
		label,
		x: x + 10,
		y: y + 22,
		size: 24,
	})
}
