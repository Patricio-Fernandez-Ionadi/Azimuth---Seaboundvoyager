export default [
	{
		id: 'sacerdotisa_irune',
		x: 64,
		y: 128,
		type: 'mentor',
		oneShot: true,
		dialogs: [
			'Irune viste de blanco y trae siempre un farolito colgado de la muñeca, aunque sea de día.',
			'La luz no se apaga nunca, ni bajo la lluvia, ni en la peor tormenta. Dicen que ella la cuida para que cuide a los marineros.',
			{
				message: 'Si vas a salir a mar abierto, podés pedir una bendición. No te la niego, pero no te la cobro: ya la pagaste con haber llegado hasta aquí.',
				options: [
					{ text: 'Bendecime, sacerdotisa.', next: 'end' },
					{ text: '¿Por qué cuidan tanto a los que zarpan?', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Irune te mira, suave. El farol de su muñeca parpadea una vez, como si se despidiera.'],
	},
	{
		id: 'farero_ancel',
		x: 80,
		y: 64,
		type: 'dialog',
		dialogs: [
			'Ancel tiene las manos quemadas por el cristal. Cuarenta años encendiendo y apagando la misma llama.',
			'Cuenta que la primera vez que subió al faro, el mar le pareció un monstruo quieto. Hoy le parece un amigo que ronca.',
			'Si la luz falla una noche, no mires al agua. Mirá al cielo: hay otra luz, más vieja, que también sabe volver a casa a los perdidos.',
		],
	},
	{
		id: 'peregrino_maite',
		x: 240,
		y: 128,
		type: 'static',
		dialogs: [
			'Una peregrina arrodillada, con los ojos cerrados. No levanta la cabeza. Murmura una plegaria que no termina.',
		],
	},
	{
		id: 'bibliotecario_eulogio',
		x: 240,
		y: 208,
		type: 'quest',
		oneShot: true,
		dialogs: [
			'Eulogio tiene la barba larga y los ojos cortos. Pasa los días leyendo textos que casi nadie sabe abrir.',
			'Hay un libro, forrado en cuero blanco, que ya nadie puede leer. La sal se metió en la tinta, o algo peor.',
			{
				message: 'Necesito a alguien con buena vista y pies ligeros. Si traés el agua bendita del faro, abro el libro y te dejo mirar.',
				options: [
					{ text: 'Veré qué puedo hacer.', next: 'end' },
					{ text: 'Mejor otro día.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Eulogio acomoda los lentes. Hay tres apilados sobre la mesa, todos con distinto aumento.'],
	},
	{
		id: 'tabernero_dionisio',
		x: 240,
		y: 288,
		type: 'shop',
		dialogs: [
			'¡Pasá, pasá! El pan salió caliente y el vino, frío.',
			'Sirve a los peregrinos como quien sirve a santos: con una mano, con la otra se persigna.',
		],
		shopConfig: {
			categories: ['food', 'consumible'],
			maxItems: 6,
		},
	},
]
