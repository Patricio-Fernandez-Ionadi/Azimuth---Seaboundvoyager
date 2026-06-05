/**
 * TrainerCapability
 * ----------------------------------------------------------------------
 * Stub inicial para NPCs que pueden enseñar o mejorar skills del jugador.
 * La implementación completa dependerá de la UI/escena de entrenamiento.
 *
 * Configuración:
 *   - trains: { skill: { cost, xpGain } }   Skills que este NPC enseña.
 *   - requiresAffinity: { branch: level }    Afinidad mínima para entrenar.
 */

export class TrainerCapability {
	constructor(npc, config = {}) {
		this.npc = npc
		this.trains = config.trains ?? {}
		this.requiresAffinity = config.requiresAffinity ?? null
	}

	/** ¿El jugador puede entrenar con este NPC? */
	canTrain(player, affinityManager) {
		if (!this.requiresAffinity) return true
		return Object.entries(this.requiresAffinity).every(([branch, level]) =>
			affinityManager?.meets(branch, level)
		)
	}
}
