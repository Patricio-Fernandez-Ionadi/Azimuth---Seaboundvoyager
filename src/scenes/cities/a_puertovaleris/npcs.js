/**
 * NPCs de Puerto Valeris (Acto 1).
 * ----------------------------------------------------------------------
 * Silas es el mentor que inicia la historia y ofrece la elección del
 * objeto misterioso. Los tres NPCs siguientes son los que ramifican
 * el camino (taberna -> pirata, mercado -> mercante, biblioteca ->
 * explorador) y ofrecen una quest introductoria cada uno.
 *
 * Los NPCs ya existentes (con tienda) se conservan para mantener el
 * ambiente del puerto.
 *
 * `type` clasifica al NPC y asigna un color por defecto vía
 * `NPCFactory.NPC_TYPE_COLORS`. Si se pasa `color` explícito, pisa al
 * color por tipo. Ver `src/entities/npc/NPCFactory.js`.
 */

export default [
	// ─────────────────────────────────────────────────────────────
	// MENTOR — Silas, el cronista del muelle (zona muelle, centro)
	// ─────────────────────────────────────────────────────────────
	{
		id: 'silas',
		x: 992,
		y: 200,
		type: 'mentor',
		quests: ['silas_intro'],
		dialogs: [
			{
				id: 'intro_1',
				message:
					'Tienes cara de no saber en qué puerto has despertado, muchacho.',
				options: [
					{
						text: '¿Dónde estoy?',
						next: 'intro_2',
					},
					{
						text: '¿Quién eres tú?',
						next: 'intro_3',
					},
				],
			},
			{
				id: 'intro_2',
				message:
					'Puerto Valeris. Un puerto de paso, siempre envuelto en la neblina. Te vi bajar del Galeón Susurrante tambaleándote, como sonámbulo.',
				next: 'intro_4',
			},
			{
				id: 'intro_3',
				message:
					'Silas, el cronista del muelle. Registro a todos los que llegan y se van. Y a veces... a los que el destino empuja a mi escritorio.',
				next: 'intro_4',
			},
			{
				id: 'intro_4',
				message:
					'En medio del caos tu mano se cerró instintivamente sobre algo que dejé aquí. No te culpo: a veces el destino elige por nosotros.',
				next: 'intro_choice',
			},
			{
				id: 'intro_choice',
				message: 'No olvides tomar tu objeto antes de irte. ¿Cuál llevarás?',
				options: [
					{
						id: 'compass',
						text: 'La brújula de latón (vibra hacia el mar abierto).',
						next: 'after_choice',
					},
					{
						id: 'scroll',
						text: 'El pergamino sellado (un contrato con un nombre familiar).',
						next: 'after_choice',
					},
					{
						id: 'dagger',
						text: 'La daga oxidada (con una calavera sonriente en la empuñadura).',
						next: 'after_choice',
					},
				],
			},
			{
				id: 'after_choice',
				message:
					'Ah, ya veo. Eso explica la mirada en tus ojos. Bien, Elian. Si quieres sobrevivir en Puerto de la Bruma, ese objeto será tu primer mapa. Ahora tienes un problema inmediato: el puerto es grande y peligroso. Hay gente en la taberna, en el mercado y en la biblioteca que puede ayudarte. Escoge tu propio camino.',
				next: 'end',
			},
		],
	},

	// ─────────────────────────────────────────────────────────────
	// QUEST PIRATA — Marea Roja, en la Taberna "El Ancla Oxidada"
	// (zona taberna, oeste)
	// ─────────────────────────────────────────────────────────────
	{
		id: 'marea_roja',
		x: 320,
		y: 560,
		type: 'quest',
		quests: ['taberna_intro'],
		dialogs: [
			'¡Ja! Otro lobo de mar con cara de no saber dónde se metió.',
			{
				message: 'Si quieres trabajo sucio y paga rápida, el Ancla Oxidada es tu lugar.',
				options: [
					{
						text: '¿Qué trabajo me ofreces?',
						requires: { quests: ['silas_intro'] },
						next: 'job_offer',
					},
					{ text: 'Solo paso por aquí.', next: 'end' },
				],
			},
			{
				id: 'job_offer',
				message:
					'Hay un convoy de la Armada que se retrasó por la tormenta. Si me ayudas a "redistribuir" su carga, te pago 50 de oro y un nombre en esta taberna.',
				options: [
					{ text: 'Acepto el trabajo.', next: 'end' },
					{ text: 'Déjame pensarlo.', next: 'end' },
				],
			},
		],
	},

	// ─────────────────────────────────────────────────────────────
	// QUEST MERCANTE — Escribano del Gremio, en el Mercado de Aduanas
	// (zona mercado, centro)
	// ─────────────────────────────────────────────────────────────
	{
		id: 'escribano_gremio',
		x: 992,
		y: 560,
		type: 'quest',
		quests: ['mercado_intro'],
		dialogs: [
			'Buenos días. ¿Viene por asuntos del Gremio o solo de paso?',
			{
				message:
					'Tenemos un envío urgente a Ciudad Mercaris. Si demuestra su valía, puedo ofrecerle un contrato formal.',
				options: [
					{
						text: 'Me interesa el contrato.',
						requires: { quests: ['silas_intro'] },
						next: 'contract',
					},
					{ text: 'Solo estoy mirando.', next: 'end' },
				],
			},
			{
				id: 'contract',
				message:
					'Negocia conmigo el precio justo. Si me convence, obtendrá 80 de oro y un aval para futuras operaciones.',
				options: [
					{ text: 'Firmo el contrato.', next: 'end' },
					{ text: 'Lo pensaré.', next: 'end' },
				],
			},
		],
	},

	// ─────────────────────────────────────────────────────────────
	// QUEST EXPLORADOR — Erudito de la Biblioteca/Cartografía
	// (zona biblioteca, este)
	// ─────────────────────────────────────────────────────────────
	{
		id: 'erudito_biblioteca',
		x: 1600,
		y: 560,
		type: 'quest',
		quests: ['biblioteca_intro'],
		dialogs: [
			'¿Escuchas eso? Son los susurros de los textos que nadie lee.',
			{
				message:
					'Tengo un mapa incompleto. Si me ayudas a descifrar los símbolos, te entregaré un fragmento de mapa y una buena suma.',
				options: [
					{
						text: 'Acepto la misión.',
						requires: { quests: ['silas_intro'] },
						next: 'mission',
					},
					{ text: 'Quizás en otro momento.', next: 'end' },
				],
			},
			{
				id: 'mission',
				message:
					'Busca los cuatro símbolos ocultos en el pergamino. Tu ojo perspicaz será tu mejor herramienta.',
				options: [
					{ text: 'Empezaré ahora.', next: 'end' },
					{ text: 'Después vuelvo.', next: 'end' },
				],
			},
		],
	},

	// ─────────────────────────────────────────────────────────────
	// TIENDA — Comerciante oficial del puerto (plaza central)
	// ─────────────────────────────────────────────────────────────
	{
		x: 992,
		y: 500,
		type: 'shop',
		dialogs: [
			'¡Bienvenido a Puerto Valeris!',
			'¿Necesitas algo, marinero?',
			{
				message: 'Puedo ofrecerte algunos suministros.',
				options: [
					{ text: 'Comerciar', callback: () => {} },
					{ text: 'Salir', callback: () => {} },
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

	// ─────────────────────────────────────────────────────────────
	// DIALOG — Vecino parlanchín (plaza, junto a la taberna)
	// ─────────────────────────────────────────────────────────────
	{
		x: 600,
		y: 500,
		type: 'dialog',
		dialogs: [
			'Hola, forastero.',
			'Este lugar es peligroso.',
			'Ten cuidado con los piratas.',
		],
	},

	// ─────────────────────────────────────────────────────────────
	// SHOP — Contrabandista del callejón (plaza, junto al mercado)
	// ─────────────────────────────────────────────────────────────
	{
		x: 1380,
		y: 500,
		type: 'shop',
		dialogs: [
			'¡Bienvenido a mi tienda!',
			{
				message: 'Puedo ofrecerte algunos suministros.',
				options: [
					{ text: 'Comerciar', callback: () => {} },
					{ text: 'Salir', callback: () => {} },
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

	// ─────────────────────────────────────────────────────────────
	// STATIC — Marinero observando el mar (muelle, esquina)
	// ─────────────────────────────────────────────────────────────
	{
		x: 200,
		y: 200,
		type: 'static',
		dialogs: ['El mar no perdona.', 'Siempre hay tormenta en el horizonte.'],
	},
]
