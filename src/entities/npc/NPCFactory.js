/**
 * NPCFactory
 * ----------------------------------------------------------------------
 * Construye un NPC a partir de un objeto de configuración "data-driven".
 * Mantiene retrocompatibilidad con el formato anterior:
 *
 *   new NPC({
 *     x, y, color, id, game,
 *     dialogs, dialogPhases,   // -> DialogCapability
 *     shopConfig,              // -> Shop (ya existía)
 *     quests, autoOffer,       // -> QuestCapability
 *   })
 *
 * El factory acepta el mismo objeto que la clase NPC y produce la misma
 * instancia, pero internamente organiza las responsabilidades en
 * capabilities. Esto permite que un mismo NPC sea quest_giver + merchant
 * + dialog sin gymnastics de herencia.
 *
 * `type` (opcional): clasifica al NPC para asignar un color por defecto.
 * Valores soportados: 'mentor' | 'quest' | 'shop' | 'dialog' | 'static'.
 * Si se pasa `color` explícito, tiene prioridad sobre el del tipo.
 */

import { NPC } from '../NPC.js'
import { DialogCapability } from './DialogCapability.js'
import { QuestCapability } from './QuestCapability.js'
import { TrainerCapability } from './TrainerCapability.js'

/** Color por defecto según el tipo de NPC. */
export const NPC_TYPE_COLORS = {
	mentor: 'darkcyan',
	quest: 'darkorange',
	shop: 'mediumseagreen',
	dialog: 'dodgerblue',
	static: 'slategray',
}

/**
 * @param {Object} data   Configuración del NPC (ver formato arriba).
 * @param {Object} game   Referencia al juego.
 * @returns {NPC}
 */
export function createNPC(data, game) {
	const resolvedColor = data.color ?? NPC_TYPE_COLORS[data.type] ?? 'white'

	const npc = new NPC({
		x: data.x,
		y: data.y,
		color: resolvedColor,
		game,
		id: data.id,
		dialogs: data.dialogs,
		dialogPhases: data.dialogPhases,
		shopConfig: data.shopConfig,
		// nuevos:
		capabilitiesConfig: {
			dialog:
				data.dialogs || data.dialogPhases
					? {
							dialogs: data.dialogs,
							dialogPhases: data.dialogPhases,
							startPhase: data.startPhase,
					  }
					: null,
			quest:
				data.quests || data.offerableQuests
					? {
							offerableQuests:
								data.quests ?? data.offerableQuests ?? [],
							requiredQuests: data.requiredQuests ?? [],
							autoOffer: data.autoOffer ?? false,
					  }
					: null,
			trainer: data.trains
				? {
						trains: data.trains,
						requiresAffinity: data.requiresAffinity ?? null,
				  }
				: null,
		},
	})

	// Guardamos el tipo en la instancia para usos futuros (HUD, etc.).
	npc.type = data.type ?? null

	return npc
}
