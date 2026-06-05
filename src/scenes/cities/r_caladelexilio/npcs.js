export default [
	{
		id: 'ermitano_benjamin',
		x: 160,
		y: 128,
		type: 'mentor',
		oneShot: true,
		dialogs: [
			'Benjamín tiene las manos finas y la voz todavía con restos de salón. Alguna vez fue noble; ahora cuida cabras.',
			'Cuenta que se exilió él solo, antes de que lo exiliaran otros. La diferencia, dice, es importante.',
			{
				message: 'Si querés aprender a perder un nombre, te enseño. Si querés aprender a no perderte, te enseño otra cosa. Las dos cuestan lo mismo.',
				options: [
					{ text: 'Quiero aprender a perder un nombre.', next: 'end' },
					{ text: 'Quiero aprender a no perderme.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Benjamín mira al mar. El mar no lo mira. Ya se conocen.'],
	},
	{
		id: 'exiliado_noble_lucila',
		x: 80,
		y: 64,
		type: 'quest',
		oneShot: true,
		dialogs: [
			'Lucila viste como quien todavía se cree noble. Tiene los ojos grandes y una memoria muy larga.',
			'Perdí el nombre, no la deuda. La deuda me la cobraron. El nombre me lo robaron. Es peor.',
			{
				message: 'Si me ayudás a recuperar mi nombre, te doy lo último que me queda: un anillo con un secreto que mi madre me dejó.',
				options: [
					{ text: 'Te ayudaré.', next: 'end' },
					{ text: 'Mejor buscá vos misma.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Lucila se acomoda el pelo. Lo tiene más cuidado que el vestido.'],
	},
	{
		id: 'curandero_isidoro',
		x: 240,
		y: 64,
		type: 'dialog',
		dialogs: [
			'Isidoro atiende a todos por igual: nobles, marinos, exiliados. No pregunta de dónde vienen. No pregunta a dónde van.',
			'Cuenta que las enfermedades del exilio son las peores. No las del cuerpo, las del nombre.',
			'Si andás sin nombre, pasá por aquí. Te curo dos cosas: la herida y la urgencia de explicar quién sos.',
		],
	},
]
