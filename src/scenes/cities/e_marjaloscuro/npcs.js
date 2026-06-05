export default [
	{
		id: 'bruja_xhilda',
		x: 64,
		y: 48,
		type: 'mentor',
		oneShot: true,
		dialogs: [
			'Xhilda vive en una cabaña que parece hundirse un poco más cada año. Tiene un sapo en el hombro y otro en la mesa.',
			'Lee huesos porque dice que la gente miente, pero los huesos no.',
			{
				message: 'Si querés saber qué te depara la marisma, traeme un sapo de tres lomos. Hay uno solo, y no te va a gustar buscarlo.',
				options: [
					{ text: 'Lo buscaré.', next: 'end' },
					{ text: 'No me interesa la suerte.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['El sapo del hombro croa. Xhilda sonríe con muy pocos dientes.'],
	},
	{
		id: 'contrabandista_relio',
		x: 160,
		y: 240,
		type: 'quest',
		oneShot: true,
		dialogs: [
			'Relio tiene los pies más secos que nadie en el pantano. Eso ya dice algo.',
			'Paso frascos, polvos y alguna que otra cosa que no aparece en ninguna aduana.',
			{
				message: 'Tengo un encargo para alguien con buen oído. En la isla del centro se oye un redoble a ciertas horas. Decime qué es, y te pago.',
				options: [
					{ text: 'Iré a escuchar.', next: 'end' },
					{ text: 'Demasiado raro para mí.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Relio desaparece entre los juncos. El fango ni se inmuta.'],
	},
	{
		id: 'cazador_rosco',
		x: 64,
		y: 160,
		type: 'dialog',
		dialogs: [
			'Rosco vuelve del fango con un lagarto de dos cabezas colgando de la cintura. Lo mira con cariño.',
			'Este es Jacinto. Le mordí la cola cuando era chico y se le dividió. Ahora somos familia.',
			'Si vas a entrar al agua, untate barro en las botas. Si no, lo que hay abajo te va a oler primero.',
		],
	},
	{
		id: 'sirena_petrificada',
		x: 240,
		y: 160,
		type: 'static',
		dialogs: [
			'Una figura con cola de pez, mitad piedra, mitad carne. Tiene los ojos abiertos pero no parpadea.',
			'Murmura una canción que no termina. La misma, desde hace quién sabe cuántos años.',
		],
	},
]
