import { CityScene } from '../CityScene.js'
import { rawMap } from './raw.js'
import npcsData from './npcs.js'

const TILE_SIZE = 16

/**
 * IslaDeLosNaufragiosScene
 * Barcos hundidos como líneas de muro en el agua al este, mercado de
 * chatarra al oeste, astillero improvisado (taberna) al sur, puesto
 * del "rastreador" (biblioteca) al norte.
 */
export class IslaDeLosNaufragiosScene extends CityScene {
	constructor(game, info) {
		super(game, info, {
			rawMap,
			npcsData,
			mapWidth: rawMap[0].length * TILE_SIZE,
			mapHeight: rawMap.length * TILE_SIZE,
			startX: 160,
			startY: 112,
		})
	}
}
