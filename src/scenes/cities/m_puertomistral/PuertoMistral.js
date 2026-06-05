import { CityScene } from '../CityScene.js'
import { rawMap } from './raw.js'
import npcsData from './npcs.js'

const TILE_SIZE = 16

/**
 * PuertoMistralScene
 * Muelle amplio al norte, astilleros (mercado) al centro, taller de
 * velas (taberna) al este, muelle de cartógrafos (biblioteca) al
 * oeste.
 */
export class PuertoMistralScene extends CityScene {
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
