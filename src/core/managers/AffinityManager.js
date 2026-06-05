/**
 * AffinityManager
 * ----------------------------------------------------------------------
 * Gestiona las tres "afinidades" (brújula moral) del jugador:
 *   - rebeldia:  desprecio por la autoridad, amor por la libertad y el caos.
 *   - prestigio: honor, cumplimiento de la palabra, reputación legítima.
 *   - asombro:   curiosidad intelectual, empatía por lo desconocido.
 *
 * Rango: 0-10. Al alcanzar ciertos umbrales se desbloquean opciones de
 * diálogo o acciones especiales.
 *
 * Reglas de exclusión (de dev/plan_1.txt, líneas 21-25):
 *   - Al llegar a nivel 3 en una rama por primera vez, esa rama se vuelve
 *     la "mainAffinity" del personaje. Las otras dos quedan CAP a 3.
 *   - Al llegar a nivel 6 en la mainAffinity, la restricción se mantiene
 *     (las otras siguen CAP 3).
 *   - Al llegar a nivel 9 en la mainAffinity, UNA de las dos ramas
 *     restantes puede ser elegida como "secondaryAffinity" y subir hasta 6.
 *   - La tercera rama permanece CAP 3.
 *
 * Esto impide que el jugador se "fullee" en todas las ramas a la vez.
 *
 * Emite eventos:
 *   - affinityChanged:   { branch, value, prevValue, capped }
 *   - mainAffinitySet:   { branch }
 *   - secondaryAffinitySet: { branch }
 */

const BRANCHES = ['rebeldia', 'prestigio', 'asombro']
const MAX_VALUE = 10

export class AffinityManager {
	constructor(game) {
		this.game = game
		this.player = game.player
		this.eventSystem = game.eventSystem
	}

	/**
	 * Cap máximo que puede alcanzar una rama según la configuración actual.
	 * @param {string} branch
	 * @returns {number}
	 */
	maxAllowed(branch) {
		const main = this.player.mainAffinity
		const secondary = this.player.secondaryAffinity
		const mainLevel = main ? this.player.affinities[main] : 0

		// La rama principal siempre puede llegar al máximo.
		if (branch === main) return MAX_VALUE

		// La rama secundaria puede llegar a 6 sólo si la principal >= 9.
		if (branch === secondary) {
			return mainLevel >= 9 ? 6 : 3
		}

		// Resto: cap 3 si ya hay mainAffinity (siempre, sin importar nivel).
		if (main) return 3

		// Si aún no hay main, todas las ramas son libres.
		return MAX_VALUE
	}

	/**
	 * ¿La rama puede alcanzar el nivel dado sin violar la regla de caps?
	 */
	canReach(branch, level) {
		return level <= this.maxAllowed(branch)
	}

	/**
	 * Suma afinidad a una rama respetando las reglas de exclusión.
	 * @param {string} branch  'rebeldia' | 'prestigio' | 'asombro'
	 * @param {number} amount  Cantidad a sumar (puede ser negativo).
	 * @returns {{value:number, prevValue:number, capped:boolean, leveledUp:boolean}}
	 */
	addAffinity(branch, amount) {
		const current = this.player.affinities
		if (current[branch] === undefined) {
			return { value: 0, prevValue: 0, capped: false, leveledUp: false }
		}

		const prevValue = current[branch]
		const desired = prevValue + amount

		// Si no hay mainAffinity y vamos a cruzar el umbral 3, fijarla.
		if (!this.player.mainAffinity && desired >= 3 && prevValue < 3) {
			this.player.mainAffinity = branch
			this.eventSystem.emit('mainAffinitySet', { branch })
		}

		// Aplicar cap correspondiente.
		const cap = this.maxAllowed(branch)
		const finalValue = Math.max(0, Math.min(cap, desired))
		const capped = finalValue !== desired
		current[branch] = finalValue

		// Si la mainAffinity acaba de llegar a 9 y no hay secundaria,
		// promover automáticamente la rama "no main" con más afinidad.
		if (
			this.player.mainAffinity === branch &&
			finalValue >= 9 &&
			!this.player.secondaryAffinity
		) {
			const others = BRANCHES.filter((b) => b !== branch)
			const promoted = others.reduce((a, b) =>
				current[a] >= current[b] ? a : b
			)
			this.player.secondaryAffinity = promoted
			this.eventSystem.emit('secondaryAffinitySet', { branch: promoted })
		}

		const leveledUp =
			Math.floor(finalValue / 3) > Math.floor(prevValue / 3) &&
			finalValue > 0

		const result = { branch, value: finalValue, prevValue, capped, leveledUp }
		this.eventSystem.emit('affinityChanged', result)
		return result
	}

	/** Devuelve el valor actual de la rama (0 si no existe). */
	getValue(branch) {
		return this.player.affinities[branch] ?? 0
	}

	/** ¿La rama tiene al menos el nivel indicado? */
	meets(branch, level) {
		return this.getValue(branch) >= level
	}

	/** Lista de ramas válidas. */
	static get branches() {
		return BRANCHES
	}
}
