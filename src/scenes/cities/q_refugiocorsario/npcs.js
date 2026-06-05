export default [
	{
		id: 'capitan_corsario_ikaro',
		x: 160,
		y: 128,
		type: 'mentor',
		oneShot: true,
		dialogs: [
			'Ikaro lleva la patente real cosida al chaleco. La ha pedido tres veces y se la han renovado dos.',
			'Habla de leyes con el mismo cariño con el que otros hablan del mar. Es un cariño útil.',
			{
				message: 'Si vas a navegar bajo bandera, te enseño a no meterte en líos. Si vas a navegar sin bandera, también.',
				options: [
					{ text: 'Bandera primero.', next: 'end' },
					{ text: 'Sin bandera.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Ikaro se toca la patente. La tela está más limpia que el resto del chaleco.'],
	},
	{
		id: 'contratista_narea',
		x: 240,
		y: 64,
		type: 'quest',
		oneShot: true,
		dialogs: [
			'Narea tiene una mesa con tres plumas y un tintero siempre lleno. Asigna contratos como otros reparten cartas.',
			'Hay un bergantín que viene del norte con demasiado vino y poca escolta. La aduana quiere que llegue completo.',
			{
				message: 'Si lo escoltás, te firmo un papel que te salva de tres preguntas de la Armada. Si no querés firmar nada, andate.',
				options: [
					{ text: 'Acepto el contrato.', next: 'end' },
					{ text: 'No firmo papeles.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Narea sella el papel. La cera tiene el sello de un rey que ya no gobierna.'],
	},
	{
		id: 'navegante_ekaitz',
		x: 80,
		y: 64,
		type: 'dialog',
		dialogs: [
			'Ekaitz conoce todas las rutas legales. Algunas las conoce mejor que la Armada. Eso no lo dice él, lo dicen los mapas.',
			'Hay tres formas de no perderse en el mar: un buen compás, un buen oído y un buen amigo. La tercera es la más cara.',
		],
	},
	{
		id: 'tabernero_legales',
		x: 80,
		y: 240,
		type: 'shop',
		dialogs: [
			'Tabernero Legales no le pone apodo al vino. El vino tiene nombre, año y, a veces, lugar de origen.',
		],
		shopConfig: {
			categories: ['food', 'consumible'],
			maxItems: 5,
		},
	},
]
