export default [
	{
		id: 'capitan_olgerd',
		x: 160,
		y: 144,
		type: 'mentor',
		oneShot: true,
		dialogs: [
			'Olgerd te mira de arriba abajo. Tiene una cicatriz que le parte la ceja y un ojo más claro que el otro.',
			'¿Vienes a alistarte o a curiosear? Las dos cosas se castigan distinto, así que elegí bien.',
			{
				message: 'Si querés que te enseñe a defender una muralla, primero mostrame que sabés defenderte de pie.',
				options: [
					{ text: 'Quiero alistarme.', next: 'end' },
					{ text: 'Solo paso por aquí.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Olgerd vuelve a mirar la puerta. La bandera con el dragón flamea seca: hoy no hay viento.'],
	},
	{
		id: 'herrero_brunhild',
		x: 240,
		y: 64,
		type: 'shop',
		dialogs: [
			'Brunhild golpea el hierro con la misma furia con la que habla. Las dos manos le quedan a la misma altura.',
			'No vende espadas finas. Vende las que cortan después de tres tormentas.',
		],
		shopConfig: {
			categories: ['weapon', 'consumible'],
			maxItems: 6,
		},
	},
	{
		id: 'recluta_dubi',
		x: 80,
		y: 240,
		type: 'dialog',
		dialogs: [
			'Dubi es el más joven de la guardia. Le tiemblan las manos cuando tiene que sostener la lanza.',
			'Anoche, jura que escuchó un rugido que venía de las murallas. No del otro lado, sino de adentro.',
			'Si vos también lo escuchás, decímelo. Si no, mejor no me lo digas.',
		],
	},
	{
		id: 'armero_toraldo',
		x: 240,
		y: 240,
		type: 'quest',
		oneShot: true,
		dialogs: [
			'Torraldo mide los ángulos con un astrolabio. Está armando algo enorme en el patio.',
			'Necesito tres muelles de roble, una polea de cobre y a alguien que sepa treparse al paredón sin marearse.',
			{
				message: 'Si me traés los materiales, te dejo probar la primera descarga. Es mejor que cualquier cañón que hayas visto.',
				options: [
					{ text: 'Veré qué consigo.', next: 'end' },
					{ text: 'Mejor no me meta.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Torraldo vuelve a sus planos. Tiene los dedos manchados de tinta hasta los codos.'],
	},
]
