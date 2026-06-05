export default [
	{
		id: 'astrologo_berenice',
		x: 80,
		y: 128,
		type: 'mentor',
		oneShot: true,
		dialogs: [
			'Berenice mira al cielo aún de día. Dice que las estrellas se ven aunque no las veas.',
			'Lee las mareas como otros leen las manos: por las líneas que el agua deja sobre la arena.',
			{
				message: 'Si vas a navegar lejos, decime cuándo naciste. No te voy a decir la fecha, te voy a decir el mar que te conviene.',
				options: [
					{ text: 'Te lo digo.', next: 'end' },
					{ text: 'Mejor no saberlo.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Berenice vuelve a mirar al cielo. Tiene los ojos irritados de tanto buscar lo que no se ve.'],
	},
	{
		id: 'pescador_lais',
		x: 80,
		y: 64,
		type: 'dialog',
		dialogs: [
			'Lais tiene las manos llenas de sal y los ojos llenos de paciencia. Sabe de corrientes como otros saben de nombres.',
			'Hay días en que el agua se pone color de vino. Esos días no se sale. Esos días vuelven cosas que no se habían ido del todo.',
			'Si vas a pescar, no silbes. El mar reconoce los silbidos y a veces devuelve a quien los hace.',
		],
	},
	{
		id: 'vendedora_conchas_irati',
		x: 240,
		y: 64,
		type: 'shop',
		dialogs: [
			'Irati guarda las conchas en cajas etiquetadas por el sonido que hacen al soplarlas.',
		],
		shopConfig: {
			categories: ['unique', 'comercial'],
			maxItems: 5,
		},
	},
	{
		id: 'mareante_zoilo',
		x: 240,
		y: 240,
		type: 'quest',
		oneShot: true,
		dialogs: [
			'Zoilo vino nadando desde muy lejos. Tiene los ojos grandes y la voz todavía mojada.',
			'Vi una luz bajo el agua. Blanca, quieta, del tamaño de un hombre. Bajó, subió, y se quedó como esperando.',
			{
				message: 'Si bajás a ver y volvés, te cambio lo que traigas por un pasaje y provisiones. Si no volvés, le diré a alguien que te busque.',
				options: [
					{ text: 'Iré a ver.', next: 'end' },
					{ text: 'No es para mí.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Zoilo se seca las manos. Las tiene arrugadas de tanto agua, o de tanto esperar.'],
	},
]
