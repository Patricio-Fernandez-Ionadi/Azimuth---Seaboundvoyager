export default [
	{
		id: 'recolector_pecios_iderne',
		x: 80,
		y: 64,
		type: 'mentor',
		oneShot: true,
		dialogs: [
			'Iderne conoce cada barco que se hundió en estas aguas. Lleva un cuaderno con sus nombres, sus rutas, sus últimas palabras.',
			'Recoge lo que el mar devuelve, lo ordena, lo cuida. Algunos restos aún guardan pertenencias de la gente que los perdió.',
			{
				message: 'Si querés aprender a leer un naufragio, traeme un objeto de un barco que no haya sido reclamado. Cualquier cosa. Yo le pongo nombre.',
				options: [
					{ text: 'Lo buscaré.', next: 'end' },
					{ text: 'No quiero esos objetos.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Iderne acaricia el cuaderno. Tiene las tapas gastadas de tanto abrirlo y cerrarlo.'],
	},
	{
		id: 'buzo_titan',
		x: 80,
		y: 240,
		type: 'quest',
		oneShot: true,
		dialogs: [
			'Titán baja cada mañana y sube cada tarde. Tiene los ojos rojos del agua con sal y las manos curtidas de cuerdas.',
			'Hay un galeón que se hundió hace veinte años. Tres cubiertas, un mascarón de león, y oro suficiente como para no tener que volver a bajar.',
			{
				message: 'Tengo el mapa. No tengo el coraje. Si venís conmigo, dividimos lo que encontremos. Si no, lo encuentro yo y te debo una copa.',
				options: [
					{ text: 'Iré con vos.', next: 'end' },
					{ text: 'Mejor solo no vayas.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Titán se limpia la sal de la cara. La sal es nueva. La cara, no.'],
	},
	{
		id: 'capitan_naufrago_aimar',
		x: 240,
		y: 64,
		type: 'dialog',
		dialogs: [
			'Aimar llegó a nado. No tiene barco, no tiene mapa, no tiene nombre en ninguna lista. Tiene la historia.',
			'Cuando se hundió mi barco, lo último que vi fue la cocina encendida. Todavía la huelo. La cocina, no el barco.',
			'Si te subís a un barco, dejá un nombre en la costa. Si volvés, lo borrás. Si no, queda.',
		],
	},
	{
		id: 'chatarrero_leix',
		x: 80,
		y: 128,
		type: 'shop',
		dialogs: [
			'Leix vende pedazos de barco como otros venden recuerdos: ordenados, etiquetados, sin historia.',
		],
		shopConfig: {
			categories: ['consumible', 'comercial', 'utility'],
			maxItems: 6,
		},
	},
]
