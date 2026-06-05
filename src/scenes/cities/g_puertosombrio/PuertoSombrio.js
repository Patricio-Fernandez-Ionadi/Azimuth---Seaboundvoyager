import { CityScene } from '../CityScene.js'
import { rawMap } from './raw.js'
import npcsData from './npcs.js'

const TILE_SIZE = 16

/**
 * PuertoSombrioScene
 * Puerto de contrabandistas: taberna "El Aguja" al norte, mercado al
 * sur, callejones estrechos en el centro.
 */
export class PuertoSombrioScene extends CityScene {
	constructor(game, info) {
		super(game, info, {
			rawMap,
			npcsData,
			mapWidth: rawMap[0].length * TILE_SIZE,
			mapHeight: rawMap.length * TILE_SIZE,
			startX: 160,
			startY: 144,
		})
	}
}
