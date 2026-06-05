export default [
	{
		id: 'medium_axpe',
		x: 80,
		y: 128,
		type: 'mentor',
		oneShot: true,
		dialogs: [
			'Axpe tiene los ojos vendados. Dice que si los abre, ve demasiado. La venda huele a sal y a un perfume viejo.',
			'Cuenta que del otro lado hay una cola. Gente esperando que alguien los nombre para irse del todo.',
			{
				message: 'Si querés aprender a ver lo que no se ve, decime el nombre de alguien que ya no esté. Yo me encargo del resto.',
				options: [
					{ text: 'Tengo un nombre.', next: 'end' },
					{ text: 'No quiero ver nada.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Axpe gira la cabeza, como si hubiera escuchado un nombre que nadie dijo.'],
	},
	{
		id: 'fantasma_sin_nombre',
		x: 240,
		y: 128,
		type: 'quest',
		oneShot: true,
		dialogs: [
			'Un fantasma con ropa de marinero. Tiene los ojos muy abiertos. No sabe quién es. No sabe qué quiere.',
			'A veces habla. A veces se queda en silencio, como si la voz se le hubiera ido con el nombre.',
			{
				message: 'Si me das un nombre, me voy. Cualquier nombre. No hace falta que sea el mío. Ya me olvidé del mío.',
				options: [
					{ text: 'Te doy el mío.', next: 'end' },
					{ text: 'Mejor no dar nombres así.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['El fantasma se queda. El nombre que le diste se lo lleva el viento, no él.'],
	},
	{
		id: 'monje_exorcista_beltza',
		x: 160,
		y: 240,
		type: 'dialog',
		dialogs: [
			'Beltza lleva un collar de ajos y un libro encuadernado en piel de algo que no es animal.',
			'Yo no echo a los fantasmas. Les doy una razón para irse. A veces la razón es un nombre. A veces, un deber.',
			'Si alguna vez ves a alguien que no termina de irse, no le grites. Preguntale qué le falta. Después, devolvéselo.',
		],
	},
]
