export default [
	{
		id: 'druida_lanix',
		x: 160,
		y: 128,
		type: 'mentor',
		oneShot: true,
		dialogs: [
			'Lanix tiene la barba verde de verdad, no de pintura. La niebla le obedece más que a nadie.',
			'Cuando habla con ella, se hace a un lado como si la dejara pasar.',
			{
				message: 'Si querés aprender a no perderte en la bruma, dejá un objeto tuyo en el círculo de piedras. Después volvé a buscarlo. Si no podés, no estabas listo.',
				options: [
					{ text: 'Lo dejaré.', next: 'end' },
					{ text: 'Mejor no juego con la niebla.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Lanix se pierde en la bruma. Detrás de él, queda un olor a tierra húmeda.'],
	},
	{
		id: 'vidente_argia',
		x: 160,
		y: 240,
		type: 'quest',
		oneShot: true,
		dialogs: [
			'Argia tiene los ojos blancos. Dice que ve mejor sin color.',
			'Veo cosas que no pasaron. A veces pasan después, y me alegro. A veces no pasan, y me alegro más.',
			{
				message: 'Hay alguien en este puerto que va a morir antes del próximo barco. No sé quién. Quiero saberlo antes que la persona. ¿Me ayudás?',
				options: [
					{ text: 'Te ayudaré.', next: 'end' },
					{ text: 'No quiero saberlo.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Argia parpadea. Es la primera vez que alguien la ve hacerlo.'],
	},
	{
		id: 'cazador_sombras_oden',
		x: 80,
		y: 192,
		type: 'dialog',
		dialogs: [
			'Oden caza lo que se mueve cuando nadie lo mira. Dice que en la bruma hay más cosas de las que el ojo cuenta.',
			'Una vez seguí a mi propia sombra. Se me escapó. Desde entonces me sigue a mí, pero nunca la del todo.',
		],
	},
]
