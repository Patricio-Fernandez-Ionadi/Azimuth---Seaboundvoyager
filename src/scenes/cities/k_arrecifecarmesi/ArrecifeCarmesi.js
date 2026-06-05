import { CityScene } from '../CityScene.js'
import { rawMap } from './raw.js'
import npcsData from './npcs.js'

const TILE_SIZE = 16

/**
 * ArrecifeCarmesiScene
 * Agua (10) rodeando, muelle al sur, mercado pequeño en isla de coral
 * al centro, taberna pirata al norte, cabañas de buceo (biblioteca) al
 * este.
 */
export class ArrecifeCarmesiScene extends CityScene {
	constructor(game, info) {
		super(game, info, {
			rawMap,
			npcsData,
			mapWidth: rawMap[0].length * TILE_SIZE,
			mapHeight: rawMap.length * TILE_SIZE,
			startX: 160,
			startY: 80,
		})
	}
}
