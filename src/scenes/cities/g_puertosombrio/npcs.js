export default [
	{
		id: 'maestra_ladrones_tafia',
		x: 160,
		y: 128,
		type: 'mentor',
		oneShot: true,
		dialogs: [
			'Tafía sonríe con un ojo abierto y otro cerrado, como si midiera cuánto vale lo que le mostrás.',
			'Enseña a entrar sin hacer ruido y a salir sin dejar huellas. Las dos cosas se pagan distinto.',
			{
				message: 'Si querés una clase, primero hacé un trabajo. Hay un mercader al este que se atrasó con la cuota. Cobrale y volvé.',
				options: [
					{ text: 'Acepto el trabajo.', next: 'end' },
					{ text: 'Mejor no me meta.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Tafía se esfuma entre dos sombras. Una queda temblando un momento, como despidiéndose.'],
	},
	{
		id: 'soplon_baltasar',
		x: 80,
		y: 192,
		type: 'quest',
		oneShot: true,
		dialogs: [
			'Baltasar vende secretos al por mayor y al por menor. Tiene un cuaderno con tapas de cuero barato y hojas muy usadas.',
			'Hay un barco que va a llegar de noche, sin farol, sin bandera. Trae algo que no quieren que se vea.',
			{
				message: 'Si me decís qué trae, te paso la ubicación exacta y un mapa del muelle. Cobro después, cuando confirmes.',
				options: [
					{ text: 'Iré a mirar.', next: 'end' },
					{ text: 'No quiero problemas con nadie.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Baltasar guarda el cuaderno. Le cuesta, porque tiene las manos siempre húmedas.'],
	},
	{
		id: 'contrabandista_coro',
		x: 240,
		y: 192,
		type: 'dialog',
		dialogs: [
			'Coro tiene un ojo verde y otro negro, y un lunar en la barbilla que se toca cuando piensa.',
			'Pasa especias, pasa venenos. A veces, dice, es lo mismo.',
			'Si necesitás algo que no se consigue, preguntame. Si no lo tengo, sé quién lo tiene. Y no siempre es persona.',
		],
	},
	{
		id: 'tabernero_nictalope',
		x: 160,
		y: 64,
		type: 'shop',
		dialogs: [
			'Nictálope sirve en vasos anchos, sin preguntar nombres. La luz del local es la justa para no ver al de al lado.',
			'Si te ve la cara, no vuelve a servirte. Es la regla.',
		],
		shopConfig: {
			categories: ['food', 'consumible', 'contraband'],
			maxItems: 6,
		},
	},
	{
		id: 'vigia_ciego',
		x: 240,
		y: 64,
		type: 'static',
		dialogs: [
			'Un vigía tuerto, con el parche torcido. Dice que ve mejor con el ojo cerrado que con el abierto.',
			'A veces señala al mar y dice "ese" y nadie ve a quién se refiere.',
		],
	},
]
