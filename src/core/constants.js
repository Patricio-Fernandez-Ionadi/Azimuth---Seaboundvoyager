export const SCENES = {
	city: {
		valeris: {
			name: 'Puerto Valeris',
			scene: 'puerto_valeris_scene',
			npcs: [
				{
					x: 340,
					y: 320,
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
			],
		},
	},
	menu: 'menu_scene',
	creation: 'creation_scene',
	map: 'world_map_scene',
}
