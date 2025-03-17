import { fontStyles } from '../core/fonts.js'

export const Text = ({
	ctx,
	x = 0,
	y = 0,
	size = 16,
	label = '',
	color = 'white',
	type = fontStyles.body.name,
}) => {
	ctx.fillStyle = color
	ctx.font = size + 'px ' + type
	ctx.fillText(label, x, y)
}
