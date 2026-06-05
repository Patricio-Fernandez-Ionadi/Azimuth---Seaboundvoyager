import { Shop } from '../components/Shop.js'
import { DialogCapability } from './npc/DialogCapability.js'
import { QuestCapability } from './npc/QuestCapability.js'
import { TrainerCapability } from './npc/TrainerCapability.js'

/**
 * NPC
 * ----------------------------------------------------------------------
 * Entidad espacial (posición, sprite, hitbox) que vive en una escena de
 * ciudad. Su comportamiento (qué hace al interactuar) se compone a través
 * de "capabilities":
 *
 *   - dialog:    maneja los textos que el NPC dice.
 *   - quest:     ofrece quests al jugador.
 *   - shop:      abre una tienda (composición con la clase Shop existente).
 *   - trainer:   enseña skills.
 *
 * La construcción recomendada es vía `createNPC(data, game)` (ver
 * NPCFactory.js) que arma la configuración correcta a partir de un
 * objeto "data-driven". Esta clase sigue aceptando el formato antiguo
 * para mantener compatibilidad con las 22 escenas de ciudad.
 */
export class NPC {
	constructor(config) {
		this.game = config.game
		this.x = config.x
		this.y = config.y
		this.width = 32
		this.height = 32
		this.color = config.color
		this.id = config.id

		/* --- Estado de interacción --- */
		this.isInteracting = false
		this.hasAutoInteracted = false

		/* --- Diálogo (compatibilidad hacia atrás + DialogCapability) --- */
		this.dialogs = config.dialogs ?? []
		this.dialogPhases = config.dialogPhases ?? null
		this.dialogPhase = config.dialogPhase ?? 0

		/* --- Capabilities por composición --- */
		this.capabilities = {}

		// Dialog
		if (config.capabilitiesConfig?.dialog) {
			this.capabilities.dialog = new DialogCapability(
				this,
				config.capabilitiesConfig.dialog
			)
		} else if (this.dialogs.length || this.dialogPhases) {
			// Si no se pasó capabilitiesConfig pero hay dialogs, armamos una
			// capability equivalente para que el sistema nuevo pueda usarla.
			this.capabilities.dialog = new DialogCapability(this, {
				dialogs: this.dialogs,
				dialogPhases: this.dialogPhases,
				startPhase: this.dialogPhase,
			})
		}

		// Quest
		if (config.capabilitiesConfig?.quest) {
			this.capabilities.quest = new QuestCapability(
				this,
				config.capabilitiesConfig.quest
			)
		}

		// Trainer
		if (config.capabilitiesConfig?.trainer) {
			this.capabilities.trainer = new TrainerCapability(
				this,
				config.capabilitiesConfig.trainer
			)
		}

		// Shop (la clase ya existía, queda como capability `shop`)
		this.shop = config.shopConfig ? new Shop(this, config.shopConfig) : null
		if (this.shop) this.capabilities.shop = this.shop

		// Referencia rápida a la capability de quest (muchos sistemas lo leen).
		this.questCapability = this.capabilities.quest ?? null
	}

	/**
	 * ¿El NPC tiene algo que decir AHORA?
	 * Devuelve true si:
	 *   - Tiene contenido principal aún no consumido, o
	 *   - Tiene despedida pendiente de mostrar.
	 * Para los one-shot sin despedida, devuelve false tras consumir.
	 */
	hasDialog() {
		return this.capabilities.dialog?.canShowAnything() ?? false
	}

	/** ¿El NPC ofrece quests disponibles AHORA? */
	hasQuestToOffer() {
		const qm = this.game.questManager
		return this.capabilities.quest?.hasAvailable(qm) ?? false
	}

	update() {
		// Mentor (Silas): auto-interactuar solo en el primer encuentro.
		// Se desactiva tras la primera interacción (manual o auto) para
		// no entrar en bucle si el jugador se aleja y vuelve.
		if (this.id === 'silas' && !this.hasAutoInteracted) {
			if (this.isPlayerNear() && !this.isInteracting) {
				this.interact()
			}
		}
	}

	draw(ctx, camera) {
		ctx.fillStyle = this.color
		ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height)
	}

	/**
	 * Abre el diálogo con este NPC. Devuelve `true` si la interacción se
	 * inició correctamente, `false` si fue rechazada (NPC ya en
	 * interacción o sin contenido que mostrar).
	 *
	 * El return permite a CityScene decidir si "consumir" la tecla E o
	 * reintentarla contra otro NPC. Es importante cuando un NPC cercano
	 * (p. ej. el mentor ya consumido) ocupa el primer lugar del array
	 * y bloquearía el ruteo de la tecla a NPCs válidos.
	 */
	interact() {
		if (this.isInteracting) return false
		// Si el NPC ya no tiene nada que mostrar, ignoramos la interacción.
		if (!this.hasDialog()) return false
		this.isInteracting = true
		// El mentor Silas no se vuelve a auto-disparar tras la primera
		// interacción (sea manual o auto).
		if (this.id === 'silas') this.hasAutoInteracted = true
		// Sincronizar `this.dialogs` con la fase activa de la capability.
		if (this.capabilities.dialog) {
			this.dialogs = this.capabilities.dialog.getActiveDialogs()
		} else if (this.dialogPhases) {
			this.dialogs = this.dialogPhases[this.dialogPhase]
		}
		this.game.eventSystem.emit('npcInteracted', this)
		return true
	}

	endInteraction() {
		this.isInteracting = false
		const dialogCap = this.capabilities.dialog
		if (dialogCap) {
			dialogCap.advancePhase()
		} else if (this.dialogPhases) {
			this.dialogPhase = Math.min(
				this.dialogPhase + 1,
				this.dialogPhases.length - 1
			)
		}
		this.game.eventSystem.emit('interactionEnded', this)
	}

	isPlayerNear() {
		const dx = this.game.player.x - this.x
		const dy = this.game.player.y - this.y
		const distance = Math.sqrt(dx * dx + dy * dy)
		return distance < 150
	}
}
