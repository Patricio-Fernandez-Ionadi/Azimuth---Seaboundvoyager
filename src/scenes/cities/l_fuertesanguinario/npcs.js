export default [
	{
		id: 'verdugo_eztiba',
		x: 160,
		y: 128,
		type: 'mentor',
		oneShot: true,
		dialogs: [
			'Eztiba se abanica con una hoja de papel. Tiene las manos lavadas y la conciencia, dice, en orden.',
			'Trabaja desde hace mucho. Cuenta que aprendió a no escuchar los nombres.',
			{
				message: 'Si querés que te enseñe a no temblar, hacé una sola cosa: mirá a quien tenés delante como si ya no estuviera.',
				options: [
					{ text: 'Lo intentaré.', next: 'end' },
					{ text: 'Mejor no aprenda esto.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Eztiba deja el abanico. La hoja tiene un nombre escrito, ya tachado.'],
	},
	{
		id: 'pirata_sanguinario_rugido',
		x: 240,
		y: 192,
		type: 'quest',
		oneShot: true,
		dialogs: [
			'Rugido ríe mostrando tres dientes de oro. Los demás, se los llevó el mar o los perdió peleando.',
			'Tengo un cofre que saqué de un barco que se hundió dos veces. La segunda vez no volvió a subir.',
			{
				message: 'Hay algo adentro que todavía late. Si te animás a abrirlo, te lo vendo barato. Si no, te lo vendo más caro.',
				options: [
					{ text: 'Lo abro yo.', next: 'end' },
					{ text: 'No quiero ese cofre cerca.', next: 'end' },
				],
			},
		],
		farewellDialogs: ['Rugido se limpia la sangre seca de la uña. La sangre no es suya.'],
	},
	{
		id: 'prisionero_ivo',
		x: 80,
		y: 192,
		type: 'dialog',
		dialogs: [
			'Ivo está encadenado a la pared. Tiene la voz ronca y la mirada, paciente.',
			'Me acusan de algo que no hice. O que hice pero que no recuerdan. Da igual, encadenado se está igual.',
			'Si tenés un cuchillo y un minuto, me lo vas a deber. Si no, también. Igual te lo voy a deber yo.',
		],
	},
]
