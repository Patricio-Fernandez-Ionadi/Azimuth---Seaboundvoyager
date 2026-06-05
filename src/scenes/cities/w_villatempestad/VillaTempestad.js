import { CityScene } from '../CityScene.js'
import { rawMap } from './raw.js'
import npcsData from './npcs.js'

const TILE_SIZE = 16

/**
 * VillaTempestadScene
 * Pueblo pequeño: casas (taberna al oeste, mercado al este), santuario
 * del clima (biblioteca) al norte, muelle al sur, plaza central con
 * camino.
 */
export class VillaTempestadScene extends CityScene {
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
