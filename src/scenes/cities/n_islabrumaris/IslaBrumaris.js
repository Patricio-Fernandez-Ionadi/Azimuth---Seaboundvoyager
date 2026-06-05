import { CityScene } from '../CityScene.js'
import { rawMap } from './raw.js'
import npcsData from './npcs.js'

const TILE_SIZE = 16

/**
 * IslaBrumarisScene
 * Isla con niebla: caminos entrelazados, círculo de piedras sagrado al
 * centro, cabaña druida al norte, santuario al sur.
 */
export class IslaBrumarisScene extends CityScene {
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
