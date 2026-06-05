/**
 * DialogCapability
 * ----------------------------------------------------------------------
 * Encapsula la lógica de diálogo de un NPC. Mantiene los textos que el
 * NPC dice, las fases (para conversaciones que cambian tras eventos) y
 * delega en DialogManager la reproducción visual.
 *
 * Estructura esperada de `config`:
 *   - dialogs:        Array plano de strings o nodos { message, options }.
 *   - dialogPhases:   Array de arrays de nodos. Si existe, `dialogs` se
 *                     toma de `dialogPhases[phase]` y se avanza de fase
 *                     tras cada interacción cerrada.
 *   - startPhase:     Fase inicial (default 0).
 *
 * Emite eventos:
 *   - dialogAdvanced:  { npc, node }
 *   - dialogEnded:     { npc }
 */

export class DialogCapability {
	constructor(npc, config = {}) {
		this.npc = npc
		this.dialogs = config.dialogs ?? []
		this.dialogPhases = config.dialogPhases ?? null
		this.dialogPhase = config.startPhase ?? 0
	}

	/** Devuelve el array de nodos activos para la fase actual. */
	getActiveDialogs() {
		if (this.dialogPhases) {
			return this.dialogPhases[this.dialogPhase] ?? []
		}
		return this.dialogs
	}

	/** Avanza de fase (si hay fases). Se llama al cerrar un diálogo. */
	advancePhase() {
		if (!this.dialogPhases) return
		const last = this.dialogPhases.length - 1
		this.dialogPhase = Math.min(this.dialogPhase + 1, last)
	}

	/** ¿El NPC tiene contenido de diálogo? */
	hasContent() {
		return this.getActiveDialogs().length > 0
	}
}
