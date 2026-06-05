/**
 * SkillManager
 * ----------------------------------------------------------------------
 * Maneja la progresión y uso de las tres habilidades del jugador:
 *   - perspicacia: notar detalles, detectar mentiras, encontrar pistas.
 *   - negociacion: regatear, persuadir, conseguir mejores precios.
 *   - destreza:    combate, armas de fuego, sigilo y agilidad.
 *
 * Cada skill se modela como { value, xp } donde:
 *   - value: nivel actual (0-100).
 *   - xp:    experiencia acumulada hacia el siguiente nivel.
 *
 * Curva de progresión (ajustable): xpNecesaria(nivel) = nivel * 100.
 * Esto significa que subir del 0 al 100 cuesta 5050 XP en total.
 *
 * Emite eventos:
 *   - skillChanged: { skill, value, xp, leveledUp }
 *   - skillCheck:   { skill, roll, total, dc, success, mod }
 */

const SKILL_KEYS = ['perspicacia', 'negociacion', 'destreza']
const MAX_LEVEL = 100

export class SkillManager {
	constructor(game) {
		this.game = game
		this.player = game.player
		this.eventSystem = game.eventSystem
	}

	/** XP necesaria para pasar del nivel `level` al `level + 1`. */
	xpToNext(level) {
		return (level + 1) * 100
	}

	/** Suma XP a una skill y dispara level-ups automáticos. */
	addXP(skill, amount) {
		const s = this.player.skills?.[skill]
		if (!s || s.value >= MAX_LEVEL) {
			return { leveledUp: false, value: s?.value ?? 0 }
		}

		s.xp += amount
		let leveledUp = false

		// Subir varios niveles de una sola vez si la cantidad de XP es grande.
		while (s.xp >= this.xpToNext(s.value) && s.value < MAX_LEVEL) {
			s.xp -= this.xpToNext(s.value)
			s.value += 1
			leveledUp = true
		}

		// Tope final.
		if (s.value >= MAX_LEVEL) {
			s.value = MAX_LEVEL
			s.xp = 0
		}

		this.eventSystem.emit('skillChanged', {
			skill,
			value: s.value,
			xp: s.xp,
			leveledUp,
		})

		return { leveledUp, value: s.value }
	}

	/** Devuelve el nivel actual de una skill (0 si no existe). */
	getValue(skill) {
		return this.player.skills?.[skill]?.value ?? 0
	}

	/** ¿La skill alcanzó al menos el valor indicado? */
	meets(skill, minValue) {
		return this.getValue(skill) >= minValue
	}

	/**
	 * Realiza una tirada de skill.
	 * @param {string} skill   Nombre de la skill.
	 * @param {number} dc      Dificultad (se compara contra `total`).
	 * @param {number} mod     Modificador extra (ej: +5 por afinidad aliada).
	 * @returns {{roll:number,total:number,dc:number,mod:number,success:boolean}}
	 */
	useSkill(skill, dc, mod = 0) {
		const value = this.getValue(skill)
		const roll = Math.floor(Math.random() * 100) + 1 // 1-100
		const total = value + roll + mod
		const success = total >= dc

		const result = { roll, total, dc, mod, success, skill }
		this.eventSystem.emit('skillCheck', result)
		return result
	}

	/** Lista de skills válidas (útil para UI y validaciones). */
	static get keys() {
		return SKILL_KEYS
	}
}
