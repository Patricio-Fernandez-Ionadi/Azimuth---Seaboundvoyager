import { CityScene } from '../CityScene.js'
import { rawMap } from './raw.js'
import npcsData from './npcs.js'

const TILE_SIZE = 16

/**
 * CiudadLuzmarScene
 * Faro al centro-oeste, santuario/biblioteca al este, plaza central,
 * taberna al sur, muelle al norte.
 */
export class CiudadLuzmarScene extends CityScene {
	constructor(game, info) {
		super(game, info, {
			rawMap,
			npcsData,
			mapWidth: rawMap[0].length * TILE_SIZE,
			mapHeight: rawMap.length * TILE_SIZE,
			startX: 160,
			startY: 80,
		})
	}
}
