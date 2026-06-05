export default [
	{
		id: 'capitana_carminia',
		x: 160,
		y: 64,
		type: 'mentor',
		oneShot: true,
		dialogs: [
			'Carminia tiene un ojo de vidrio verde y un loro en el hombro que dice cosas que ella desmiente.',
			'Busca tesoros hundidos. Dice que ya levantó seis galeones, dos ciudades sumergidas y un pueblo entero que no quería ser encontrado.',
			{
				message: 'Si querés que te enseñe a leer un arrecife, traeme un coral rojo del fondo. Te aviso: no se saca con las manos.',
				options: [
					{ text: 'Lo buscaré.', next: 'end' },
					{ text: 'Mejor en otra vida.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['El loro grazna algo. Carminia lo mira como si se lo tradujera y asiente.'],
	},
	{
		id: 'buzo_perlas_amaru',
		x: 240,
		y: 192,
		type: 'quest',
		oneShot: true,
		dialogs: [
			'Amaru tiene las manos llenas de cortes pequeños, como si el arrecife le cobrara cada inmersión.',
			'Hay un coral que me corta y se mueve. No es coral, sé que no es coral. Pero tampoco es pez.',
			{
				message: 'Si lo ves, no lo toques con la mano. Traéme una muestra del agua que lo rodea. Quiero saber qué respira.',
				options: [
					{ text: 'Iré a mirar.', next: 'end' },
					{ text: 'No me convence.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Amaru se venda un dedo. Lo hace con la misma calma con la que se ata los zapatos.'],
	},
	{
		id: 'herrero_coral_heno',
		x: 160,
		y: 240,
		type: 'shop',
		dialogs: [
			'Heno trabaja el coral como otros trabajan la plata. Lo lava, lo pule, lo deja brillar sin que pierda el color.',
		],
		shopConfig: {
			categories: ['unique', 'comercial'],
			maxItems: 5,
		},
	},
	{
		id: 'coral_viviente',
		x: 80,
		y: 160,
		type: 'static',
		dialogs: [
			'Una figura rojo oscuro, inmóvil, con bocas pequeñas que no se abren. A veces una brisa la mueve como si respirara.',
			'Susurra algo que no se entiende, aunque quién sabe cuántas veces lo intenta.',
		],
	},
]
