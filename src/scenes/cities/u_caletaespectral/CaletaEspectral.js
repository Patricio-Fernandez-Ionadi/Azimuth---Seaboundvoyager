import { CityScene } from '../CityScene.js'
import { rawMap } from './raw.js'
import npcsData from './npcs.js'

const TILE_SIZE = 16

/**
 * CaletaEspectralScene
 * Caleta rodeada de agua, cementerio de marineros (muro formando
 * lápidas) al este, cabaña del medium (taberna) al oeste, santuario de
 * almas (biblioteca) al norte.
 */
export class CaletaEspectralScene extends CityScene {
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
