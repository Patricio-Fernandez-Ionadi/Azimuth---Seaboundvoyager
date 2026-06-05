export default [
	{
		id: 'sacerdote_del_rayo_kolbrand',
		x: 160,
		y: 128,
		type: 'mentor',
		oneShot: true,
		dialogs: [
			'Kolbrand habla en susurros cuando no hay rayos. Cuando los hay, grita tanto que parece él quien los trae.',
			'Cuenta que cada trueno tiene un nombre y una deuda. Si no se le paga, vuelve a caer en el mismo lugar.',
			{
				message: 'Si querés que te enseñe a escuchar la tormenta, traeme un cristal de rayo. Hay uno solo en esta roca. Y está hondo.',
				options: [
					{ text: 'Lo buscaré.', next: 'end' },
					{ text: 'Mejor no.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Kolbrand levanta la cara al cielo. Por un momento parece un poste a punto de encenderse.'],
	},
	{
		id: 'ermitano_ogthan',
		x: 160,
		y: 256,
		type: 'quest',
		oneShot: true,
		dialogs: [
			'Ogthan vive en una cabaña que huele a metal caliente. Tiene el pelo blanco y las manos negras.',
			'Yo invoco la tormenta. La llamo, le pongo nombre, le doy un encargo. A veces vuelve con el encargo hecho. A veces no.',
			{
				message: 'Tengo un pendiente viejo con la roca. Si me traés una brasa de su última caída, te la cobro barata.',
				options: [
					{ text: 'Iré a la roca.', next: 'end' },
					{ text: 'No quiero deudas con tormentas.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Ogthan mira al cielo. Una nube se acerca, aunque no la había hace un momento.'],
	},
	{
		id: 'buscador_cristales_maite',
		x: 80,
		y: 192,
		type: 'dialog',
		dialogs: [
			'Maite busca cristales petrificados por el rayo. Dice que cada uno guarda un fragmento de la frase que dijo el cielo al caer.',
			'Hay uno que llevo seis meses buscando. Lo escuché caer, lo vi humear. Ahora no aparece. A veces lo siento en el bolsillo y cuando miro no hay nada.',
		],
	},
]
