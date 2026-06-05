import { CityScene } from '../CityScene.js'
import { rawMap } from './raw.js'
import npcsData from './npcs.js'

const TILE_SIZE = 16

/**
 * FuerteSanguinarioScene
 * Fortaleza de los piratas más crueles: muros gruesos, plaza de
 * ejecuciones central, mercado negro al este, taberna del verdugo al
 * oeste, mazmorras al norte.
 */
export class FuerteSanguinarioScene extends CityScene {
	constructor(game, info) {
		super(game, info, {
			rawMap,
			npcsData,
			mapWidth: rawMap[0].length * TILE_SIZE,
			mapHeight: rawMap.length * TILE_SIZE,
			startX: 160,
			startY: 160,
		})
	}
}
