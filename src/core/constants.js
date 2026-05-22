export const SCENES = {
	city: {
		valeris: {
			name: 'Puerto Valeris',
			scene: 'puerto_valeris_scene',
			npcs: [
				{
					id: 0,
					x: 420,
					y: 304,
					color: 'blue',
					dialogs: [
						'¡Bienvenido a Puerto Valeris!',
						'¿Necesitas algo, marinero?',
						{
							message: 'Puedo ofrecerte algunos suministros.',
							options: [
								{
									text: 'Comerciar',
									callback: () => console.log('Abrir ventana de comercio'),
								},
								{
									text: 'Salir',
									callback: () => console.log('Salir del diálogo'),
								},
							],
						},
						'¡Buena suerte en tu viaje!',
					],
					shopConfig: {
						categories: ['consumible', 'food', 'cartography'],
						restockTimes: [8, 17],
						exclusions: ['contraband'],
						qualities: ['common', 'rare'],
					},
				},
				{
					id: 3,
					x: 300,
					y: 260,
					color: 'green',
					dialogs: [
						'Hola, forastero.',
						'Este lugar es peligroso.',
						'Ten cuidado con los piratas.',
					],
				},
				{
					id: 0,
					x: 380,
					y: 50,
					color: 'yellow',
					dialogs: [
						'¡Bienvenido a mi tienda!',
						{
							message: 'Puedo ofrecerte algunos suministros.',
							options: [
								{
									text: 'Comerciar',
									callback: () => console.log('Abrir ventana de comercio'),
								},
								{
									text: 'Salir',
									callback: () => console.log('Salir del diálogo'),
								},
							],
						},
					],
					shopConfig: {
						categories: ['consumible', 'contraband', 'weapon', 'pirate'],
						restockTimes: [6, 18],
						defaultItems: [
							{ id: 111, quantity: 1, isFixed: true },
							{ id: 13, quantity: 1, isFixed: true },
							{ id: 23, quantity: 1, isFixed: false },
							{ id: 301, quantity: 3, isFixed: false },
						],
						randomItems: {
							categories: ['consumible', 'contraband', 'weapon', 'pirate'],
							qualities: ['common', 'rare'],
							maxItems: 10,
						},
					},
				},
				{
					id: 1,
					x: 420,
					y: 420,
					color: 'darkcyan',
					dialogs: [
						'¿Qué pasa muchacho?',
						'Parece que estas perdido',
						'¿Necesitas ayuda?',
					],
					dialogPhases: [
						[
							'¿Qué pasa muchacho?',
							'Parece que estas perdido',
							'¿Necesitas ayuda?',
						],
						[
							'¡Has vuelto!',
							'Me alegra que estés bien.',
							'Sigue explorando el puerto.',
						],
					],
				},
			],
		},
		bahiadeloslamentos: {
			name: 'Bahía de los Lamentos',
			scene: 'bahia_de_los_lamentos_scene',
			npcs: [
				{
					id: 0,
					x: 160,
					y: 160,
					color: 'red',
					dialogs: ['Bahía de los Lamentos...', 'Ten cuidado por aquí.'],
				},
			],
		},
		ciudadluzmar: {
			name: 'Ciudad Luzmar',
			scene: 'ciudad_luzmar_scene',
			npcs: [
				{
					id: 0,
					x: 160,
					y: 160,
					color: 'gold',
					dialogs: [
						'Bienvenido a Ciudad Luzmar.',
						'El faro brilla con fuerza hoy.',
					],
				},
			],
		},
		fuertedragal: {
			name: 'Fuerte Dragal',
			scene: 'fuerte_dragal_scene',
			npcs: [
				{
					id: 0,
					x: 160,
					y: 160,
					color: 'crimson',
					dialogs: ['Alto ahí.', 'Este es territorio de Dragal.'],
				},
			],
		},
		marjaloscuro: {
			name: 'Marjal Oscuro',
			scene: 'marjal_oscuro_scene',
			npcs: [
				{
					id: 0,
					x: 160,
					y: 160,
					color: 'darkslategray',
					dialogs: [
						'Las mareas aquí son traicioneras.',
						'No te adentres sin guía.',
					],
				},
			],
		},
		bastiondemedianoche: {
			name: 'Bastión de Medianoche',
			scene: 'bastion_de_medianoche_scene',
			npcs: [
				{
					id: 0,
					x: 160,
					y: 160,
					color: 'indigo',
					dialogs: ['El Bastión nunca duerme.', '¿Qué negocios tienes aquí?'],
				},
			],
		},
		puertosombrio: {
			name: 'Puerto Sombrío',
			scene: 'puerto_sombrio_scene',
			npcs: [
				{
					id: 0,
					x: 160,
					y: 160,
					color: 'darkblue',
					dialogs: [
						'Puerto Sombrío te da la bienvenida.',
						'No todo es lo que parece.',
					],
				},
			],
		},
		ciudadaurea: {
			name: 'Ciudad Áurea',
			scene: 'ciudad_aurea_scene',
			npcs: [
				{
					id: 0,
					x: 160,
					y: 160,
					color: 'goldenrod',
					dialogs: ['¡Ciudad Áurea!', 'El oro fluye como el agua aquí.'],
				},
			],
		},
		puertodelasmareas: {
			name: 'Puerto de las Mareas',
			scene: 'puerto_de_las_mareas_scene',
			npcs: [
				{
					id: 0,
					x: 160,
					y: 160,
					color: 'teal',
					dialogs: [
						'Las mareas dictan nuestro ritmo.',
						'Bienvenido, navegante.',
					],
				},
			],
		},
		rocadeltrueno: {
			name: 'Roca del Trueno',
			scene: 'roca_del_trueno_scene',
			npcs: [
				{
					id: 0,
					x: 160,
					y: 160,
					color: 'darkred',
					dialogs: ['¿Has escuchado el trueno?', 'Este lugar está maldito.'],
				},
			],
		},
		arrecifecarmesi: {
			name: 'Arrecife Carmesí',
			scene: 'arrecife_carmesi_scene',
			npcs: [
				{
					id: 0,
					x: 160,
					y: 160,
					color: 'coral',
					dialogs: ['Los arrecifes son hermosos...', '...y mortales.'],
				},
			],
		},
		fuertesanguinario: {
			name: 'Fuerte Sanguinario',
			scene: 'fuerte_sanguinario_scene',
			npcs: [
				{
					id: 0,
					x: 160,
					y: 160,
					color: 'maroon',
					dialogs: ['Sangre y acero.', 'Eso es lo que encontrarás aquí.'],
				},
			],
		},
		puertomistral: {
			name: 'Puerto Mistral',
			scene: 'puerto_mistral_scene',
			npcs: [
				{
					id: 0,
					x: 160,
					y: 160,
					color: 'skyblue',
					dialogs: ['El viento Mistral nos guía.', 'Buen viaje, marinero.'],
				},
			],
		},
		islabrumaris: {
			name: 'Isla Brumaris',
			scene: 'isla_brumaris_scene',
			npcs: [
				{
					id: 0,
					x: 160,
					y: 160,
					color: 'seagreen',
					dialogs: ['Isla Brumaris...', 'La niebla nunca se disipa.'],
				},
			],
		},
		puertoespejomar: {
			name: 'Puerto Espejomar',
			scene: 'puerto_espejomar_scene',
			npcs: [
				{
					id: 0,
					x: 160,
					y: 160,
					color: 'lightseagreen',
					dialogs: ['El mar es un espejo hoy.', 'Bienvenido a Espejomar.'],
				},
			],
		},
		isladelosnaufragios: {
			name: 'Isla de los Naufragios',
			scene: 'isla_de_los_naufragios_scene',
			npcs: [
				{
					id: 0,
					x: 160,
					y: 160,
					color: 'saddlebrown',
					dialogs: ['Restos de barcos por doquier.', 'No es un buen presagio.'],
				},
			],
		},
		refugiocorsario: {
			name: 'Refugio Corsario',
			scene: 'refugio_corsario_scene',
			npcs: [
				{
					id: 0,
					x: 160,
					y: 160,
					color: 'darkorange',
					dialogs: ['¡Ja! Otro lobo de mar.', 'Los buenos no duran aquí.'],
				},
			],
		},
		caladelexilio: {
			name: 'Cala del Exilio',
			scene: 'cala_del_exilio_scene',
			npcs: [
				{
					id: 0,
					x: 160,
					y: 160,
					color: 'dimgray',
					dialogs: ['La cala del exilio...', 'Aquí terminan los olvidados.'],
				},
			],
		},
		isladelabismo: {
			name: 'Isla del Abismo',
			scene: 'isla_del_abismo_scene',
			npcs: [
				{
					id: 0,
					x: 160,
					y: 160,
					color: 'darkslateblue',
					dialogs: ['El abismo te observa.', 'No mires al agua.'],
				},
			],
		},
		isladelossusurros: {
			name: 'Isla de los Susurros',
			scene: 'isla_de_los_susurros_scene',
			npcs: [
				{
					id: 0,
					x: 160,
					y: 160,
					color: 'mediumpurple',
					dialogs: ['¿Escuchas los susurros?', 'El viento trae recuerdos.'],
				},
			],
		},
		caletaespectral: {
			name: 'Caleta Espectral',
			scene: 'caleta_espectral_scene',
			npcs: [
				{
					id: 0,
					x: 160,
					y: 160,
					color: 'ghostwhite',
					dialogs: ['Fantasmas...', 'Esta caleta está encantada.'],
				},
			],
		},
		ciudadmercaris: {
			name: 'Ciudad Mercaris',
			scene: 'ciudad_mercaris_scene',
			npcs: [
				{
					id: 0,
					x: 160,
					y: 160,
					color: 'darkgoldenrod',
					dialogs: [
						'Mercaris, la ciudad del comercio.',
						'Todo tiene un precio.',
					],
					shopConfig: {
						categories: ['consumible', 'food', 'cartography'],
						restockTimes: [8, 17],
						exclusions: [],
						qualities: ['common', 'rare', 'excellent'],
					},
				},
			],
		},
		villatempestad: {
			name: 'Villa Tempestad',
			scene: 'villa_tempestad_scene',
			npcs: [
				{
					id: 0,
					x: 160,
					y: 160,
					color: 'slategray',
					dialogs: ['La tormenta se acerca...', 'Será mejor que te refugies.'],
				},
			],
		},
	},
	menu: 'menu_scene',
	creation: 'creation_scene',
	map: 'world_map_scene',
}

export const CITY_ZONE_MAP = {
	'Puerto Veleris': SCENES.city.valeris,
	'Bahía de los Lamentos': SCENES.city.bahiadeloslamentos,
	'Ciudad Luzmar': SCENES.city.ciudadluzmar,
	'Fuerte Dragal': SCENES.city.fuertedragal,
	'Marjal Oscuro': SCENES.city.marjaloscuro,
	'Bastión de Medianoche': SCENES.city.bastiondemedianoche,
	'Puerto Sombrío': SCENES.city.puertosombrio,
	'Ciudad Áurea': SCENES.city.ciudadaurea,
	'Puerto de las Mareas': SCENES.city.puertodelasmareas,
	'Roca del Trueno': SCENES.city.rocadeltrueno,
	'Arrecife Carmesí': SCENES.city.arrecifecarmesi,
	'Fuerte Sanguinario': SCENES.city.fuertesanguinario,
	'Puerto Mistral': SCENES.city.puertomistral,
	'Isla Brumaris': SCENES.city.islabrumaris,
	'Puerto Espejomar': SCENES.city.puertoespejomar,
	'Isla de los Naufragios': SCENES.city.isladelosnaufragios,
	'Refugio Corsario': SCENES.city.refugiocorsario,
	'Cala del Exilio': SCENES.city.caladelexilio,
	'Isla del Abismo': SCENES.city.isladelabismo,
	'Isla de los Susurros': SCENES.city.isladelossusurros,
	'Caleta Espectral': SCENES.city.caletaespectral,
	'Ciudad Mercaris': SCENES.city.ciudadmercaris,
	'Villa Tempestad': SCENES.city.villatempestad,
}
