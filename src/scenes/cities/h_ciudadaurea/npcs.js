export default [
	{
		id: 'banquero_aristipo',
		x: 160,
		y: 128,
		type: 'mentor',
		oneShot: true,
		dialogs: [
			'Arístipo tiene los dedos suaves, los modales perfectos y una manera de mirar que hace que uno se pregunte cuánto le debe.',
			'Enseña el valor de las cosas, sí. Pero sobre todo enseña el valor de la información: cuánto cuesta, cuánto rinde, cuánto duele.',
			{
				message: 'Si querés aprender a no perder nunca, te doy una clase. A cambio quiero que me cuentes un secreto que no hayas contado antes.',
				options: [
					{ text: 'Tengo uno. Acepto.', next: 'end' },
					{ text: 'Mejor en otro momento.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Arístipo cierra el libro. Las páginas tienen números en tinta roja.'],
	},
	{
		id: 'orfebre_liriope',
		x: 240,
		y: 64,
		type: 'shop',
		dialogs: [
			'Liríope examina cada pieza con una lupa que parece más grande que su ojo. Compra lingotes, vende raras exquisiteces.',
		],
		shopConfig: {
			categories: ['unique', 'comercial'],
			maxItems: 5,
		},
	},
	{
		id: 'noble_anastasio',
		x: 80,
		y: 64,
		type: 'dialog',
		dialogs: [
			'Anastasio bosteza con cuidado, como si tuviera que cuidar hasta eso. Colecciona rarezas que ya no sabe dónde guardar.',
			'Me aburro. Llevo tres semanas sin ver algo que me sorprenda. ¿Traés algo curioso? Cualquier cosa con historia me sirve.',
			'Una vez le compré a un marinero una botella con un susurro dentro. Me duró la velada entera.',
		],
	},
	{
		id: 'subastador_crisipo',
		x: 80,
		y: 240,
		type: 'quest',
		oneShot: true,
		dialogs: [
			'Crisipo habla rápido y mira más rápido. Tiene tres martillos, uno para cada tipo de subasta.',
			'Hay una pieza que quiero para la próxima subasta. Está en manos de alguien que no sabe lo que tiene.',
			{
				message: 'Si me la conseguís, te doy un porcentaje y un palco en la primera fila. Si no me la conseguís, no me conocés.',
				options: [
					{ text: 'Veré qué encuentro.', next: 'end' },
					{ text: 'Mejor no me meta.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Crisipo guarda el martillo. Por el modo en que lo hace, se nota cuál prefiere.'],
	},
]
