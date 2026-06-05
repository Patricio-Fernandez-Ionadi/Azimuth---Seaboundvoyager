import { CityScene } from '../CityScene.js'
import { rawMap } from './raw.js'
import npcsData from './npcs.js'

const TILE_SIZE = 16

/**
 * PuertoDeLasMareasScene
 * Muelle muy grande al norte, mercado de pescado al este, observatorio
 * (biblioteca) al oeste, taberna al sur, plaza central.
 */
export class PuertoDeLasMareasScene extends CityScene {
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
