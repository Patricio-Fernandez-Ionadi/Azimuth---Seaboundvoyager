import { CityScene } from '../CityScene.js'
import { rawMap } from './raw.js'
import npcsData from './npcs.js'

const TILE_SIZE = 16

/**
 * BahiaDeLosLamentosScene
 * ----------------------------------------------------------------------
 * Bahía azotada por naufragios. Muelle al norte, cementerio central
 * con lápidas, taberna al este.
 */
export class BahiaDeLosLamentosScene extends CityScene {
	constructor(game, info) {
		super(game, info, {
			rawMap,
			npcsData,
			mapWidth: rawMap[0].length * TILE_SIZE,
			mapHeight: rawMap.length * TILE_SIZE,
			startX: 160,
			startY: 96,
		})
	}
}
