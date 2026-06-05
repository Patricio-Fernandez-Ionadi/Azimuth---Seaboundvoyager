export default [
	{
		id: 'carette',
		x: 80,
		y: 48,
		type: 'dialog',
		dialogs: [
			'Carette lleva cuarenta años contando tumbas en este muelle. Dice que ya no distingue a los vivos de los ahogados.',
			'Los nombra uno por uno. Les habla como si fueran a responderle. A veces, según cuenta, alguien responde.',
			{
				message: 'Si andás buscando a un amigo, decime su nombre. Si su fantasma anda por aquí, lo sabré antes que vos.',
				options: [
					{ text: '¿Quién cuida de las almas que no descansan?', next: 'end' },
					{ text: 'Aquí no busco a nadie. Adiós.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Carette vuelve a su lista. La sal sigue secándose sobre la lápida más reciente.'],
	},
	{
		id: 'coro_eco',
		x: 144,
		y: 128,
		type: 'static',
		dialogs: [
			'Una figura pálida, con los ojos cerrados, repite en voz baja: "Por qué… por qué… por qué…"',
			'No se mueve. No parece verte. Sólo murmura.',
		],
	},
	{
		id: 'tabernera_olalla',
		x: 256,
		y: 272,
		type: 'quest',
		oneShot: true,
		dialogs: [
			'Olalla sirve un vaso sin preguntar. Tiene las orejas grandes y la memoria larga.',
			'Anoche cantaban otra vez en el agua. Una voz de mujer, clarita como campana. Cantaba en una lengua que nadie en la bahía entiende.',
			{
				message: 'Si te acercás al muelle de madrugada y traés lo que oigas, te lo cambio por monedas y un mapa. ¿Te interesa?',
				options: [
					{ text: 'Volveré con la canción.', next: 'end' },
					{ text: 'Esto no es para mí.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Olalla limpia el vaso. La sal del muelle lo deja opaco antes del anochecer.'],
	},
	{
		id: 'vigia_niebla',
		x: 144,
		y: 240,
		type: 'dialog',
		dialogs: [
			'El vigía ya no duerme. Dice que la niebla le devuelve los faroles apagados.',
			'A veces, en lugar de barcos, ve a gente caminando sobre el agua. Los cuenta, los nombra, les grita que vuelvan.',
			'Si te internás en la niebla, llevate un cordel. Y no respondas si te llaman por tu nombre.',
		],
	},
]
