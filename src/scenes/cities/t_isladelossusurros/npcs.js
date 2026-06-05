export default [
	{
		id: 'espia_amaia',
		x: 160,
		y: 128,
		type: 'mentor',
		oneShot: true,
		dialogs: [
			'Amaia escucha más de lo que habla. Tiene los ojos del color de la lluvia, y la misma paciencia.',
			'Enseña a escuchar lo no dicho: los silencios, las pausas, las palabras que se traga la garganta.',
			{
				message: 'Si querés aprender, traeme un secreto que no sea tuyo. Cuanto más ajeno, mejor. Los secretos propios enseñan poco.',
				options: [
					{ text: 'Tengo uno. Acepto.', next: 'end' },
					{ text: 'Mejor no juego con secretos.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Amaia guarda el secreto detrás de un suspiro. El suspiro suena a cierre.'],
	},
	{
		id: 'soplon_marcial',
		x: 240,
		y: 64,
		type: 'quest',
		oneShot: true,
		dialogs: [
			'Marcial vende lo que oye. Tiene una libreta con tapas de badana, y la tinta siempre fresca.',
			'Hay alguien en este puerto que no es quien dice ser. Lo sé porque alguien pagó para que lo supiera.',
			{
				message: 'Si me decís quién es, te paso el nombre y la coartada. Si no querés saber, mejor no me preguntes a mí.',
				options: [
					{ text: '¿Quién paga por esos secretos?', next: 'end' },
					{ text: 'Mejor no saberlo.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Marcial cierra la libreta. La tinta todavía está fresca.'],
	},
	{
		id: 'mercader_secretos_eider',
		x: 80,
		y: 240,
		type: 'shop',
		dialogs: [
			'Eider no tiene tienda. Tiene una mesa, una vela y una lista de precios que no se ven hasta que pagás.',
			'El primer secreto es gratis: el secreto nunca es lo que se cuenta, sino a quién se lo contás.',
		],
		shopConfig: {
			categories: ['unique', 'comercial'],
			maxItems: 4,
		},
	},
]
