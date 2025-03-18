const CAT = {
	food: 'food',
	consumible: 'consumible',
	singleUse: 'singleUse',
	pirate: 'pirate',
	contraband: 'contraband',
	comercial: 'comercial',
	medicine: 'medicine',
	weapon: 'weapon',
	unique: 'unique',
	utility: 'utility',
	cartography: 'cartography',
}
const stats = {
	hungerRestore: 0,
	damage: 0,
	mapCompletion: 0,
	reslience: 0,
}
const QTY = {
	common: 'common',
	rare: 'rare',
	exelent: 'exelent',
	unique: 'unique',
}

export const ITEMS_DATA = [
	{
		maxStack: 99,
		name: 'Gold Key',
		description: 'Una llave unica, debe ser para algo valioso.',
		src: '/src/components/assets/items/key_gold_item.png',
		categories: [CAT.consumible],
		stackeable: true,
		variant: {
			rare: {
				price: { buy: 350, sell: 40 },
			},
		},
	},
	{
		maxStack: 1,
		name: 'Botella de Ron',
		description: 'Una sucia y vieja botella de ron.',
		src: '/src/components/assets/items/bottle_rum_item.png',
		categories: [CAT.consumible, CAT.pirate, CAT.contraband],
		stackeable: false,
		variant: {
			common: {
				price: { buy: 6, sell: 3 },
			},
		},
	},
	{
		maxStack: 99,
		name: 'Fragmento de mapa',
		description: 'Faltan partes para poder entenderlo.',
		src: '/src/components/assets/items/map_fragment_item.png',
		categories: [CAT.cartography],
		stackeable: true,
		variant: {
			common: {
				price: { buy: 50, sell: 40 },
			},
			rare: {
				price: { buy: 90, sell: 70 },
			},
			exelent: {
				price: { buy: 600, sell: 450 },
			},
		},
	},
	{
		maxStack: 1,
		name: 'Mapa de la region',
		description: 'Contiene informacion valiosa de la zona.',
		src: '/src/components/assets/items/map_item.png',
		categories: [CAT.unique],
		stackeable: false,
		requirements: {
			// hablar con el cartografo en la biblioteca
		},
		variant: { unique: {} },
	},
	{
		maxStack: 99,
		name: 'Macoña',
		description: 'Para relajarse.',
		src: '/src/components/assets/items/weed_item.png',
		categories: [CAT.consumible, CAT.contraband, CAT.comercial, CAT.medicine],
		stackeable: true,
		variant: {
			common: {
				price: { buy: 4, sell: 2 },
				stats: { hungerRestore: -4, reslience: 10, health: 4 },
			},
			rare: {
				price: { buy: 7, sell: 5 },
				stats: { hungerRestore: -2, reslience: 4, health: 0 },
			},
			exelant: {
				price: { buy: 12, sell: 6 },
				stats: { hungerRestore: -10, reslience: 30, health: 10 },
			},
		},
	},
	{
		maxStack: 99,
		name: 'Carne de res',
		description: 'Nada como un buen churrasco',
		src: '/src/components/assets/items/food_beef_item.png',
		categories: [CAT.food, CAT.consumible],
		stackeable: true,
		variant: {
			common: {
				price: { buy: 8, sell: 5 },
				stats: { hungerRestore: 20 },
			},
			rare: {
				price: { buy: 8, sell: 2 },
				stats: { hungerRestore: 15, health: -10 },
			},
			exelent: {
				price: { buy: 35, sell: 8 },
				stats: { hungerRestore: 35, health: 20, reslience: 30 },
			},
		},
	},
	{
		maxStack: 1,
		name: 'Puñal',
		description: 'Arma punzante de reducido tamaño pero muy afilada.',
		src: '/src/components/assets/items/daga_item.png',
		categories: [CAT.weapon],
		stackeable: false,
		variant: {
			common: {
				price: { buy: 22, sell: 18 },
				stats: { damage: 15 },
				durability: 200,
			},
			rare: {
				price: { buy: 54, sell: 38 },
				stats: { damage: 32 },
				durability: 400,
			},
			exelent: {
				price: { buy: 120, sell: 62 },
				stats: { damage: 50 },
				durability: 1200,
			},
		},
	},
	{
		maxStack: 1,
		name: 'Morral',
		description: 'Bolsa de cuero, será util para llevar algo.',
		src: '/src/components/assets/items/bag_item.png',
		categories: [CAT.utility],
		type: 'container',
		stackeable: false,
		variant: {
			common: {
				price: { buy: 60, sell: 40 },
				size: [5, 5],
			},
			rare: {
				price: { buy: 80, sell: 59 },
				size: [8, 8],
			},
			exelent: {
				price: { buy: 160, sell: 80 },
				size: [8, 12],
			},
		},
	},
	{
		maxStack: 1,
		name: 'Licor de lujo',
		description: 'Esto si es una bebida!.',
		src: '/src/components/assets/items/pot_strenght_item.png',
		categories: [CAT.consumible, CAT.comercial],
		stackeable: false,
		variant: {
			rare: {
				price: { buy: 700, sell: 500 },
				stats: { reslience: 30 },
			},
			exelent: {
				price: { buy: null, sell: 1200 },
				stats: { reslience: 60 },
			},
		},
	},
]
