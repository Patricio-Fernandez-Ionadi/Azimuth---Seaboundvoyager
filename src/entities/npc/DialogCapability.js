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
 *   - oneShot:        Si true, el diálogo principal sólo se reproduce una
 *                     vez. Tras la primera interacción cerrada el NPC
 *                     deja de "tener diálogo" y, si se le define
 *                     `farewellDialogs`, sólo puede mostrar esa despedida.
 *   - farewellDialogs: Array de strings (lineales, sin opciones). Se
 *                     muestran una vez cuando el NPC ya consumió su
 *                     diálogo principal.
 *
 * Estados posibles del diálogo:
 *   - fresh:    aún no se mostró el diálogo principal.
 *   - consumed: diálogo principal mostrado; hay despedida pendiente.
 *   - done:     nada que mostrar (sin despedida o despedida ya dicha).
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

		this.oneShot = config.oneShot ?? false
		this.farewellDialogs = config.farewellDialogs ?? []

		this.state = 'fresh'
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

	/** ¿El NPC tiene contenido de diálogo principal definido? */
	hasContent() {
		return this.getActiveDialogs().length > 0
	}

	/** ¿Hay diálogo principal aún no mostrado? */
	hasUnseenContent() {
		return this.state === 'fresh' && this.hasContent()
	}

	/** ¿Hay despedida definida para este NPC? */
	hasFarewell() {
		return this.farewellDialogs.length > 0
	}

	/** ¿La despedida está pendiente de ser mostrada? */
	hasPendingFarewell() {
		return this.state === 'consumed' && this.hasFarewell()
	}

	/** ¿El NPC tiene algo que mostrar (principal o despedida)? */
	canShowAnything() {
		return this.hasUnseenContent() || this.hasPendingFarewell()
	}

	/**
	 * Marca el diálogo principal como consumido. Pasa a estado
	 * 'consumed' si hay despedida; a 'done' si no la hay.
	 */
	markConsumed() {
		this.state = this.hasFarewell() ? 'consumed' : 'done'
	}

	/** Marca la despedida como ya mostrada. */
	markFarewellDone() {
		this.state = 'done'
	}
}
