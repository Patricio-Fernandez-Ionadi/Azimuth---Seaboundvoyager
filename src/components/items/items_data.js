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
	craft: 'craft',
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
	excellent: 'excellent',
	unique: 'unique',
}

const PATH = '/src/components/items/assets'
const createSrc = (name) => `${PATH}/${name}.png`
const mkValue = (buy, sell) => ({ buy, sell })

/* ID ORDER */
// 0 - 9
const GEMS = [
	{
		maxStack: 30,
		name: 'Gema de la Fortaleza',
		description: 'Contiene un valor elevado.',
		src: createSrc('gem_blessed_jewel'),
		categories: [CAT.consumible, CAT.craft],
		stackeable: true,
		raw_id: 1,
		variant: {
			[QTY.excellent]: {
				price: mkValue(3000, 2300),
				stats: { reslience: 60 },
				u_id: 13,
			},
		},
	},
	{
		maxStack: 30,
		name: 'Gema del Caos',
		description: 'Contiene un valor elevado.',
		src: createSrc('gem_chaos'),
		categories: [CAT.consumible, CAT.craft],
		stackeable: true,
		raw_id: 2,
		variant: {
			[QTY.excellent]: {
				price: mkValue(5000, 2300),
				stats: { reslience: 60 },
				u_id: 23,
			},
		},
	},
]

// 10 - 19
const FOOD = [
	{
		maxStack: 99,
		name: 'Pata de Cerdo',
		description: 'Contiene un valor elevado proteinas.',
		src: createSrc('food_pata_item'),
		categories: [CAT.consumible, CAT.craft],
		stackeable: true,
		raw_id: 10,
		variant: {
			[QTY.common]: {
				price: mkValue(16, 8),
				stats: { hungerRestore: 43 },
				u_id: 101,
			},
			[QTY.rare]: {
				price: mkValue(10, 2),
				stats: { hungerRestore: 15, health: -15 },
				u_id: 102,
			},
			[QTY.excellent]: {
				price: mkValue(52, 20),
				stats: { hungerRestore: 100, health: 20, reslience: 30 },
				u_id: 103,
			},
		},
	},
	{
		maxStack: 99,
		name: 'Carne de res',
		description: 'Nada como un buen churrasco',
		src: createSrc('food_beef_item'),
		categories: [CAT.food, CAT.consumible],
		stackeable: true,
		raw_id: 11,
		variant: {
			[QTY.common]: {
				price: mkValue(8, 5),
				stats: { hungerRestore: 20 },
				u_id: 111,
			},
			[QTY.rare]: {
				price: mkValue(8, 2),
				stats: { hungerRestore: 15, health: -10 },
				u_id: 112,
			},
			[QTY.excellent]: {
				price: mkValue(35, 8),
				stats: { hungerRestore: 35, health: 20, reslience: 30 },
				u_id: 113,
			},
		},
	},
]
// 20 - 29
// 30 - 39
const DRINK = [
	{
		maxStack: 1,
		name: 'Botella de Ron',
		description: 'Una sucia y vieja botella de ron.',
		src: createSrc('bottle_rum_item'),
		categories: [CAT.consumible, CAT.pirate, CAT.contraband],
		stackeable: false,
		raw_id: 30,
		variant: {
			[QTY.common]: {
				price: mkValue(6, 3),
				u_id: 301,
			},
		},
	},
	{
		maxStack: 1,
		name: 'Licor de lujo',
		description: 'Esto si es una bebida!.',
		src: createSrc('pot_strenght_item'),
		categories: [CAT.consumible, CAT.comercial],
		stackeable: false,
		raw_id: 31,
		variant: {
			[QTY.rare]: {
				price: mkValue(700, 500),
				stats: { reslience: 30 },
				u_id: 312,
			},
			[QTY.excellent]: {
				price: mkValue(null, 1200),
				stats: { reslience: 60 },
				u_id: 313,
			},
		},
	},
]
// 40 - 49
// 50 - 59
const CARTOGRAPHY = [
	{
		maxStack: 32,
		name: 'Fragmento de mapa',
		description: 'Faltan partes para poder entenderlo.',
		src: createSrc('map_fragment_item'),
		categories: [CAT.cartography],
		stackeable: true,
		raw_id: 50,
		variant: {
			[QTY.common]: {
				price: mkValue(50, 40),
				u_id: 501,
			},
			[QTY.rare]: {
				price: mkValue(90, 70),
				u_id: 502,
			},
			[QTY.excellent]: {
				price: mkValue(600, 450),
				u_id: 503,
			},
		},
	},
	{
		maxStack: 1,
		name: 'Mapa de la region',
		description: 'Contiene informacion valiosa de la zona.',
		src: createSrc('map_item'),
		categories: [CAT.unique],
		stackeable: false,
		requirements: {
			// hablar con el cartografo en la biblioteca
		},
		raw_id: 51,
		variant: { [QTY.unique]: { u_id: 514 } },
	},
]
// 60 - 69
// 70 - 79
const UTILITY = [
	{
		maxStack: 1,
		name: 'Morral',
		description: 'Bolsa de cuero, será util para llevar algo.',
		src: createSrc('bag_item'),
		categories: [CAT.utility],
		type: 'container',
		stackeable: false,
		raw_id: 70,
		variant: {
			[QTY.common]: {
				price: mkValue(60, 40),
				size: [5, 5],
				u_id: 701,
			},
			[QTY.rare]: {
				price: mkValue(80, 59),
				size: [8, 8],
				u_id: 702,
			},
			[QTY.excellent]: {
				price: mkValue(160, 80),
				size: [8, 12],
				u_id: 703,
			},
		},
	},
	{
		maxStack: 10,
		name: 'Gold Key',
		description: 'Una llave unica, debe ser para algo valioso.',
		src: createSrc('key_gold_item'),
		categories: [CAT.consumible],
		stackeable: true,
		raw_id: 71,
		variant: {
			[QTY.rare]: {
				price: mkValue(350, 40),
				u_id: 712,
			},
		},
	},
]
// 80 - 89
// 90 - 99
// 100 - 109
const COMERCIAL = [
	{
		maxStack: 99,
		name: 'Macoña',
		description: 'Para relajarse.',
		src: createSrc('weed_item'),
		categories: [CAT.consumible, CAT.contraband, CAT.comercial, CAT.medicine],
		stackeable: true,
		raw_id: 100,
		variant: {
			[QTY.common]: {
				price: mkValue(4, 2),
				stats: { hungerRestore: -4, reslience: 10, health: 4 },
				u_id: 1001,
			},
			[QTY.rare]: {
				price: mkValue(7, 5),
				stats: { hungerRestore: -2, reslience: 4, health: 0 },
				u_id: 1002,
			},
			[QTY.excellent]: {
				price: mkValue(12, 6),
				stats: { hungerRestore: -10, reslience: 30, health: 10 },
				u_id: 1003,
			},
		},
	},
]
// 110 - 119
// 120 - 129
// 130 - 139
const WEAPON = [
	{
		maxStack: 1,
		name: 'Puñal',
		description: 'Arma punzante de reducido tamaño pero muy afilada.',
		src: createSrc('daga_item'),
		categories: [CAT.weapon],
		stackeable: false,
		raw_id: 130,
		variant: {
			[QTY.common]: {
				price: mkValue(22, 18),
				stats: { damage: 15 },
				durability: 200,
				u_id: 1301,
			},
			[QTY.rare]: {
				price: mkValue(54, 38),
				stats: { damage: 32 },
				durability: 400,
				u_id: 1302,
			},
			[QTY.excellent]: {
				price: mkValue(120, 62),
				stats: { damage: 50 },
				durability: 1200,
				u_id: 1303,
			},
		},
	},
]
// 140 - 149
// 150 - 159
// 160 - 169

export const ITEMS_DATA = GEMS.concat(FOOD)
	.concat(DRINK)
	.concat(CARTOGRAPHY)
	.concat(UTILITY)
	.concat(COMERCIAL)
	.concat(WEAPON)

// console.log(ITEMS_DATA)
