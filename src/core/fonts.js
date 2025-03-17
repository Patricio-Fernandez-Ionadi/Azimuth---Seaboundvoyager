export const fontStyles = {
	body: {
		name: 'Pirate One',
		path: '/src/assets/fonts/AnnieUseYourTelescope-Regular.ttf',
		args: [
			'Pirate One',
			"url('/src/assets/fonts/AnnieUseYourTelescope-Regular.ttf')",
		],
	},
	title: 'Arial, sans-serif',
	stats: 'Courier New, monospace',
}

const FONTS = [new FontFace(...fontStyles.body.args)]

export const loadFonts = () => {
	FONTS.forEach((f) => f.load().then((font) => document.fonts.add(font)))
}
