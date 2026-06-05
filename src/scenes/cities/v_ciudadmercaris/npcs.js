export default [
	{
		id: 'mercader_rico_baltazar',
		x: 160,
		y: 128,
		type: 'mentor',
		oneShot: true,
		dialogs: [
			'Baltazar controla medio puerto. La otra mitad, dice, la controla él también, pero con otro nombre.',
			'Enseña a leer un mercado como otros enseñan a leer un mapa: por las ausencias más que por las presencias.',
			{
				message: 'Si querés aprender, traeme algo que no se consiga. Cuanto más raro, mejor. Si lo conseguís, sabés dónde buscar. Si no, aprendiste a no buscar.',
				options: [
					{ text: 'Lo buscaré.', next: 'end' },
					{ text: 'Mejor no comprar el silencio.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Baltazar firma un papel que nadie lee. La firma vale más que el papel.'],
	},
	{
		id: 'subastador_tiro',
		x: 80,
		y: 64,
		type: 'shop',
		dialogs: [
			'Tiro subasta lo que otros ni se animan a exhibir. Tiene un martillo chico y una voz que llena la sala.',
		],
		shopConfig: {
			categories: ['unique', 'comercial', 'consumible'],
			maxItems: 8,
		},
	},
	{
		id: 'banquero_hebe',
		x: 240,
		y: 64,
		type: 'dialog',
		dialogs: [
			'Hebe tiene la sonrisa de alguien que ya hizo la cuenta. Presta a interés. A veces, también a友情.',
			'Si tenés algo que valga la pena, te lo guardo. Si no, te lo presto. Las dos cosas cuestan.',
			'El oro no se gasta, se muda. Lo importante no es cuánto tenés, sino quién sabe cuánto tenés.',
		],
	},
	{
		id: 'intermediario_ostara',
		x: 80,
		y: 240,
		type: 'quest',
		oneShot: true,
		dialogs: [
			'Ostara no compra ni vende. Conecta. Tiene una libreta con nombres que ella sola entiende.',
			'Hay un envío que se perdió entre dos muelles. No se cayó al agua. Se lo llevaron.',
			{
				message: 'Si lo encontrás antes que la aduana, te consigo un descuento en la próxima subasta. Si no, te consigo silencio.',
				options: [
					{ text: 'Buscaré el envío.', next: 'end' },
					{ text: 'Mejor no me meta con la aduana.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Ostara guarda la libreta. La libreta pesa más que una espada.'],
	},
	{
		id: 'custodio_rufo',
		x: 240,
		y: 240,
		type: 'static',
		dialogs: [
			'Rufo mide dos metros y no habla. Cuando alguien lo cruza, esa persona deja de aparecer en las listas de Baltazar.',
		],
	},
]
