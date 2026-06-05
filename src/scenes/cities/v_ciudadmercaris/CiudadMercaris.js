import { CityScene } from '../CityScene.js'
import { rawMap } from './raw.js'
import npcsData from './npcs.js'

const TILE_SIZE = 16

/**
 * CiudadMercarisScene
 * ----------------------------------------------------------------------
 * Ciudad/puerto del juego. Hereda de CityScene la cÃ¡mara, los NPCs,
 * las colisiones, el diÃ¡logo y la ventana de comercio.
 */
export class CiudadMercarisScene extends CityScene {
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