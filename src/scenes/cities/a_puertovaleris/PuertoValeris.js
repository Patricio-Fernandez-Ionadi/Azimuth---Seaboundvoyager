import { CityScene } from '../CityScene.js'
import { rawMap } from './raw.js'
import npcsData from './npcs.js'

/**
 * PuertoValerisScene
 * ----------------------------------------------------------------------
 * Ciudad inicial del jugador. Aquí ocurre la escena con Silas (Acto 1)
 * y se ramifican las tres rutas (taberna, mercado, biblioteca).
 *
 * Layout del raw map (124×68 tiles):
 *   - Filas  0-9 : mar (impasable).
 *   - Filas 10-13: muelle (zona costera, aquí está Silas).
 *   - Fila  14   : muro con puerta central (cols 60-62).
 *   - Filas 15-55: tres zonas (taberna / mercado / biblioteca).
 *   - Filas 30-31: pasillo horizontal (plaza central).
 *   - Filas 56-66: zona neutral con adornos.
 *   - Cols 60-62 : camino vertical que conecta muelle, plaza y sur.
 *
 * Hereda de CityScene, por lo que la cámara, las colisiones, el diálogo
 * y la suscripción de eventos ya están resueltos en la base.
 */
export class PuertoValerisScene extends CityScene {
	constructor(game, info) {
		super(game, info, {
			rawMap,
			npcsData,
			mapWidth: 16 * 124,
			mapHeight: 16 * 68,
			// Spawn en el pasillo central (plaza), cerca de los 3 NPCs de rama.
			startX: 950,
			startY: 166,
			drawBorder: true,
		})
	}
}
