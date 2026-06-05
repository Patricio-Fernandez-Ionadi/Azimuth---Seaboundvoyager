import { CityScene } from '../CityScene.js'
import { rawMap } from './raw.js'
import npcsData from './npcs.js'

const TILE_SIZE = 16

/**
 * CiudadMercarisScene
 * Gran mercado al centro, rodeado de caminos que llevan a: taberna al
 * norte, biblioteca al este, muelle de carga al sur, oficina del
 * subastador al oeste. Bordes con muro.
 */
export class CiudadMercarisScene extends CityScene {
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
