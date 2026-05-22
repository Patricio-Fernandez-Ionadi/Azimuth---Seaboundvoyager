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
  },
  menu: 'menu_scene',
  creation: 'creation_scene',
  map: 'world_map_scene',
}
