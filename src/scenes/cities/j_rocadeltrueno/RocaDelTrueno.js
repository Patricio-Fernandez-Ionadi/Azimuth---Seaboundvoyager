import { CityScene } from '../CityScene.js'
import { rawMap } from './raw.js'
import npcsData from './npcs.js'

const TILE_SIZE = 16

/**
 * RocaDelTruenoScene
 * Pico rocoso: mucha piedra (muro 2) simulando riscos, explanada
 * central, altar del trueno (biblioteca) al norte, cabaña (taberna) al
 * sur. Sin muelle.
 */
export class RocaDelTruenoScene extends CityScene {
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
