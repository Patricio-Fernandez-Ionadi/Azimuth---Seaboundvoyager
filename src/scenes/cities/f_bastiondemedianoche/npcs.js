export default [
	{
		id: 'conde_vladek',
		x: 160,
		y: 128,
		type: 'mentor',
		oneShot: true,
		dialogs: [
			'Vladek no parpadea. Tiene los dientes demasiado parejos y la voz, demasiado suave.',
			'Ofrece conocimiento antiguo a cambio de favores. Nunca dice cuáles favores. Nunca.',
			{
				message: 'Puedo enseñarte a ver en la oscuridad, o a hacer que otros no vean en la suya. Las dos son útiles. Las dos tienen precio.',
				options: [
					{ text: 'Acepto el trato.', next: 'end' },
					{ text: 'Volveré cuando sepa el precio.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Vladek inclina la cabeza. La sombra de la sala se mueve sola, como despidiéndose.'],
	},
	{
		id: 'aprendiz_lazaro',
		x: 240,
		y: 64,
		type: 'quest',
		oneShot: true,
		dialogs: [
			'Lázaro tiene los ojos hundidos y un delantal manchado de algo que no parece tinta.',
			'Estoy aprendiendo a reanimar cosas pequeñas. Insectos, pajaritos, una vez una rata.',
			{
				message: 'Necesito un cuerpo reciente, pequeño, y que nadie lo esté buscando. Si me lo conseguís, te enseño lo que sé.',
				options: [
					{ text: 'Veré qué encuentro.', next: 'end' },
					{ text: 'No quiero saber más.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Lázaro te mira como se mira a un posible amigo, o a una posible víctima.'],
	},
	{
		id: 'guardian_sepulcro',
		x: 80,
		y: 256,
		type: 'static',
		dialogs: [
			'Un guardia encapuchado, inmóvil, con una alabarda que no brilla. No se sabe si duerme o si ya no respira.',
		],
	},
	{
		id: 'archivo_coralia',
		x: 240,
		y: 240,
		type: 'dialog',
		dialogs: [
			'Coralia clasifica grimorios por el color de su cubierta y por el daño que causan al tacto.',
			'Sabe más de lo que dice. Dice menos de lo que sabe. Lo que no dice, lo escribe en un cuaderno que esconde bajo la alfombra.',
			'Si alguna vez necesitás un nombre verdadero, pasá por aquí. Pero no preguntes para qué lo quiero.',
		],
	},
]
