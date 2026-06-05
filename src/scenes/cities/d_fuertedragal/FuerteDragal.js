import { CityScene } from '../CityScene.js'
import { rawMap } from './raw.js'
import npcsData from './npcs.js'

const TILE_SIZE = 16

/**
 * FuerteDragalScene
 * Fortaleza militar: patio central, armería al norte, taberna militar
 * al sur, mercado de suministros al este.
 */
export class FuerteDragalScene extends CityScene {
	constructor(game, info) {
		super(game, info, {
			rawMap,
			npcsData,
			mapWidth: rawMap[0].length * TILE_SIZE,
			mapHeight: rawMap.length * TILE_SIZE,
			startX: 160,
			startY: 192,
		})
	}
}
