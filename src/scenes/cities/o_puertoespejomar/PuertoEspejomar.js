import { CityScene } from '../CityScene.js'
import { rawMap } from './raw.js'
import npcsData from './npcs.js'

const TILE_SIZE = 16

/**
 * PuertoEspejomarScene
 * Agua al sur, mercado al este, taller de espejos (taberna) al centro,
 * torre del mago (biblioteca) al norte. Caminos que parecen reflejar
 * la disposición.
 */
export class PuertoEspejomarScene extends CityScene {
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
