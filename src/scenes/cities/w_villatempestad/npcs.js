export default [
	{
		id: 'adivino_clima_argilo',
		x: 160,
		y: 64,
		type: 'mentor',
		oneShot: true,
		dialogs: [
			'Argilo mira al cielo aún de día. Tiene los ojos irritados y una barba que parece haber sido peinada por el viento.',
			'Cuenta que las tormentas tienen nombres. Y que cuando se enojan, vuelven al mismo pueblo.',
			{
				message: 'Si querés que te enseñe a leer el clima, traeme un rayo que se haya caído dos veces en el mismo lugar. Si lo conseguís, sabés que el cielo te mira.',
				options: [
					{ text: 'Lo buscaré.', next: 'end' },
					{ text: 'Mejor no ser mirado por el cielo.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Argilo levanta la nariz. Una nube que no estaba hace un momento aparece al sur.'],
	},
	{
		id: 'granjera_itxaro',
		x: 80,
		y: 240,
		type: 'quest',
		oneShot: true,
		dialogs: [
			'Itxaro tiene las manos duras y la voz todavía más. Lleva tres cosechas perdidas y una cuarta a punto.',
			'La tormenta se llevó el maíz, después el trigo, después las gallinas. La próxima se va a llevar lo que queda.',
			{
				message: 'Si me conseguís un ritual de los viejos, uno que sirva, te pago con la única gallina que me queda. Y con un secreto del pueblo.',
				options: [
					{ text: 'Buscaré el ritual.', next: 'end' },
					{ text: 'Mejor que la gallina se quede con vos.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Itxaro mira al cielo. Arriba, una nube ya está más cerca de lo que debería.'],
	},
	{
		id: 'anciano_ekhi',
		x: 240,
		y: 240,
		type: 'dialog',
		dialogs: [
			'Ekhi tiene la voz rota y la memoria, entera. Cuenta la primera tormenta como si la hubiera parido él.',
			'Esa noche el cielo se abrió en dos. De un lado, agua. Del otro, fuego. Y en el medio, nosotros.',
			'Si querés saber por qué llover aquí es siempre peor, sentate y tomá un vaso. Las respuestas están en el fondo.',
		],
	},
]
