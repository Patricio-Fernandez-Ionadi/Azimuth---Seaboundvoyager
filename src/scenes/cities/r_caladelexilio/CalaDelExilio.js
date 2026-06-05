import { CityScene } from '../CityScene.js'
import { rawMap } from './raw.js'
import npcsData from './npcs.js'

const TILE_SIZE = 16

/**
 * CalaDelExilioScene
 * Cala pequeña rodeada de muros altos: cabañas dispersas, cabaña del
 * curandero (biblioteca) al norte, taberna al este, mercado al oeste,
 * una explanada central con camino.
 */
export class CalaDelExilioScene extends CityScene {
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
