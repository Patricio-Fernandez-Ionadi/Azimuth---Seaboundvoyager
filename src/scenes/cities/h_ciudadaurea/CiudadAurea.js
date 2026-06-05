import { CityScene } from '../CityScene.js'
import { rawMap } from './raw.js'
import npcsData from './npcs.js'

const TILE_SIZE = 16

/**
 * CiudadAureaScene
 * Ciudad de la riqueza: camino en cruz, cuatro cuadrantes con mercado
 * lujoso NE, biblioteca real NO, taberna refinada SE, mercado de
 * subastas SO.
 */
export class CiudadAureaScene extends CityScene {
	constructor(game, info) {
		super(game, info, {
			rawMap,
			npcsData,
			mapWidth: rawMap[0].length * TILE_SIZE,
			mapHeight: rawMap.length * TILE_SIZE,
			startX: 160,
			startY: 208,
		})
	}
}
