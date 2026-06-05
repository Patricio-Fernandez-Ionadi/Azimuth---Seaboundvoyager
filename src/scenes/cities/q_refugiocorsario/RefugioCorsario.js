import { CityScene } from '../CityScene.js'
import { rawMap } from './raw.js'
import npcsData from './npcs.js'

const TILE_SIZE = 16

/**
 * RefugioCorsarioScene
 * Refugio legal de corsarios: muelle al norte, mercado de contratos al
 * este, taberna "La Carta de Marca" al oeste, oficina de reclutamiento
 * (biblioteca) al sur.
 */
export class RefugioCorsarioScene extends CityScene {
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
