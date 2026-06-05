import { CityScene } from '../CityScene.js'
import { rawMap } from './raw.js'
import npcsData from './npcs.js'

const TILE_SIZE = 16

/**
 * IslaDelAbismoScene
 * Isla con mucho muro rodeando, altar central (camino 9 en círculo),
 * cabaña del culto (taberna) al norte, biblioteca prohibida al sur,
 * abismo visible como agua al este.
 */
export class IslaDelAbismoScene extends CityScene {
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
