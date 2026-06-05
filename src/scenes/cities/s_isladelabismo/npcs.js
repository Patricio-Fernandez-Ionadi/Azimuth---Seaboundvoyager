export default [
	{
		id: 'cultista_oceano_profundo',
		x: 160,
		y: 128,
		type: 'mentor',
		oneShot: true,
		dialogs: [
			'Lo llaman "el que mira hacia abajo". Tiene los ojos abiertos más de lo que la gente soporta.',
			'Cuenta que debajo del agua hay algo que sueña. Y cuando sueña, la isla se mueve un centímetro.',
			{
				message: 'Si querés que te enseñe a escuchar lo que el abismo dice, dejá un objeto tuyo en el altar. Si vuelve, no era importante. Si no vuelve, era demasiado.',
				options: [
					{ text: 'Lo dejaré.', next: 'end' },
					{ text: 'Mejor no me debes al abismo.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['El cultista cierra los ojos. Por un momento, parece casi humano.'],
	},
	{
		id: 'superviviente_temis',
		x: 80,
		y: 192,
		type: 'quest',
		oneShot: true,
		dialogs: [
			'Temís llegó a la isla en un bote hecho de un solo tablón. Tiene la mirada firme y la voz, muy baja.',
			'Llevo seis años acá. Aprendí a no mirar hacia abajo. Aprendí a no preguntar quién mira desde abajo.',
			{
				message: 'Hay un ritual que se va a hacer esta noche. Si me ayudás a impedirlo, te doy lo único que me queda: el nombre del que lo organiza.',
				options: [
					{ text: 'Te ayudaré.', next: 'end' },
					{ text: 'Mejor no me meta en rituales.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Temís mira al suelo. El suelo, por un momento, parece moverse.'],
	},
	{
		id: 'sabio_del_abismo_zeru',
		x: 240,
		y: 192,
		type: 'dialog',
		dialogs: [
			'Zeru dice que bajó. Nadie le cree del todo. Tiene la ropa siempre seca y los ojos, siempre abiertos.',
			'Allá abajo no hay monstruos. Hay algo peor: silencio. Un silencio que te devuelve cosas que no querías que te devolvieran.',
			'Si alguna vez querés saber qué hay en el fondo de un abismo, mirá primero el fondo de un vaso. Es el mismo viaje, más barato.',
		],
	},
]
