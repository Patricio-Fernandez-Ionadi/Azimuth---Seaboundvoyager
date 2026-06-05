export default [
	{
		id: 'mago_espejos_ion',
		x: 160,
		y: 64,
		type: 'mentor',
		oneShot: true,
		dialogs: [
			'Ion lleva un espejo en la mano y otro en la espalda. No sabés cuál refleja mejor.',
			'Enseña a ver a través de los espejos. A veces, también a ver a través de uno mismo.',
			{
				message: 'Si querés aprender, traeme un espejo roto por la mitad. Cuanto más roto, mejor. Cuanto más te haya servido, peor.',
				options: [
					{ text: 'Lo buscaré.', next: 'end' },
					{ text: 'Mejor no saber tanto.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Ion levanta el espejo. Tu reflejo levanta el espejo. El reflejo de tu reflejo también.'],
	},
	{
		id: 'vendedora_espejos_aiume',
		x: 240,
		y: 128,
		type: 'shop',
		dialogs: [
			'Aiume vende espejos "normales". Si preguntás, te explica por qué ninguno lo es.',
		],
		shopConfig: {
			categories: ['unique', 'comercial'],
			maxItems: 5,
		},
	},
	{
		id: 'bufon_lucan',
		x: 80,
		y: 128,
		type: 'dialog',
		dialogs: [
			'Lucán hace reír a costa de cualquiera, incluido a sí mismo. Tiene un espejo de mano del que no se separa.',
			'Te digo un chiste: el de los dos que se ven en un espejo y descubren que son tres. ¿Te reís? Si te reís, no entendés. Si no te reís, tampoco.',
			'Si alguna vez perdés la cordura, te la busco. Cobro barato. La cordura vuelve más cara.',
		],
	},
	{
		id: 'doble_silencioso',
		x: 160,
		y: 240,
		type: 'quest',
		oneShot: true,
		dialogs: [
			'Una figura idéntica a vos, o casi. Tiene la misma ropa, el mismo gesto. No dice nada. Te mira.',
			'Cuando te acercás, no se mueve. Cuando te vas, no se queda.',
			{
				message: 'Si me das algo tuyo, te devuelvo algo mío. Si no me das nada, te devuelvo lo mismo. Yo.',
				options: [
					{ text: 'No juego esto.', next: 'end' },
					{ text: 'Tomá, tené esto.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['El doble se va por donde viniste. Te queda la duda de a quién dejaron.'],
	},
]
