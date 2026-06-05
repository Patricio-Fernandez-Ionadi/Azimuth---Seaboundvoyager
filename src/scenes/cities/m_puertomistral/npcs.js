export default [
	{
		id: 'maestro_velas_arantxa',
		x: 240,
		y: 128,
		type: 'mentor',
		oneShot: true,
		dialogs: [
			'Arantxa cose velas como otros escriben cartas: con cuidado, con ritmo, con la misma letra siempre.',
			'Una vela buena se conoce cuando el viento la quiere. Una mala, cuando el viento la destroza y no la empuja.',
			{
				message: 'Si querés aprender, traeme un retazo de tela vieja. Cualquiera. Hasta de tu camisa.',
				options: [
					{ text: 'Te traigo el retazo.', next: 'end' },
					{ text: 'Mejor otro día.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Arantxa sigue cosiendo. La aguja brilla a cada puntada.'],
	},
	{
		id: 'cartografo_bisente',
		x: 80,
		y: 128,
		type: 'shop',
		dialogs: [
			'Bisente tiene los ojos grandes de tanto mirar mapas al trasluz. Conoce cada ruta legal y varias que no lo son.',
		],
		shopConfig: {
			categories: ['cartography', 'unique'],
			maxItems: 5,
		},
	},
	{
		id: 'marinero_erlauntz',
		x: 160,
		y: 240,
		type: 'quest',
		oneShot: true,
		dialogs: [
			'Erlauntz tiene un barco en el nombre, pero no en el muelle. Lo perdió en una brisa, dice, una brisa con dientes.',
			'Noche cerrada, sin viento, y de pronto el barco se va. Como si alguien tirara de él desde abajo.',
			{
				message: 'Hay un mapa que muestra dónde se hundió. Si lo traés, te ayudo a buscarlo. O te ayudo a olvidarlo.',
				options: [
					{ text: 'Lo buscaré.', next: 'end' },
					{ text: 'Mejor no remover eso.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Erlauntz mira al muelle. Cuenta los barcos. Siempre el mismo número.'],
	},
	{
		id: 'viejo_hori',
		x: 160,
		y: 64,
		type: 'dialog',
		dialogs: [
			'Horí tiene la cara partida por el sol y las manos por el mar. Conoce todas las rutas y a todos los que las hicieron.',
			'Una vez llevé a un rey a una isla que no existía. Volvió dos veces más. La segunda, ya no era rey.',
			'Las rutas no se enseñan, se cuentan. Si te las cuento, son tuyas. Si no, no.',
		],
	},
]
