/**
 * QuestCapability
 * ----------------------------------------------------------------------
 * Asocia un NPC a una o más quests que puede ofrecer. Se usa para:
 *   - Mostrar íconos !/? sobre el NPC.
 *   - Determinar qué quests están disponibles al hablar con él.
 *   - Disparar la oferta al iniciar el diálogo (o como opción).
 *
 * Configuración:
 *   - offerableQuests: [questId, ...]   Quests que este NPC PUEDE ofrecer.
 *   - requiredQuests:  [questId, ...]   Prereqs para que aparezcan (!).
 *   - autoOffer:       boolean          Si true, ofrece al hablar.
 *
 * El filtrado real (por afinidad, items, etc.) lo hace QuestManager.
 */

export class QuestCapability {
	constructor(npc, config = {}) {
		this.npc = npc
		this.offerableQuests = config.offerableQuests ?? []
		this.requiredQuests = config.requiredQuests ?? []
		this.autoOffer = config.autoOffer ?? false
	}

	/** Devuelve las quests que el QuestManager reporta como disponibles. */
	getAvailable(questManager) {
		if (!questManager) return []
		const all = []
		for (const qId of this.offerableQuests) {
			if (questManager.isAvailable(qId)) all.push(qId)
		}
		return all
	}

	/** ¿Tiene quests listas para ofrecer al jugador? */
	hasAvailable(questManager) {
		return this.getAvailable(questManager).length > 0
	}
}
