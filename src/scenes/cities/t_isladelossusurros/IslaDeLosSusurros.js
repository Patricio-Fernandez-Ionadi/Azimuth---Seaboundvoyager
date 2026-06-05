import { CityScene } from '../CityScene.js'
import { rawMap } from './raw.js'
import npcsData from './npcs.js'

const TILE_SIZE = 16

/**
 * IslaDeLosSusurrosScene
 * Distribuida en plataformas: una plataforma central con camino en
 * espiral, una biblioteca al norte, un mercado de información al sur,
 * cabaña de la espía al este.
 */
export class IslaDeLosSusurrosScene extends CityScene {
	constructor(game, info) {
		super(game, info, {
			rawMap,
			npcsData,
			mapWidth: rawMap[0].length * TILE_SIZE,
			mapHeight: rawMap.length * TILE_SIZE,
			startX: 160,
			startY: 128,
		})
	}
}
