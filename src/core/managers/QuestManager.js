import { QUESTS } from '../../data/quests/index.js'

/**
 * QuestManager
 * ----------------------------------------------------------------------
 * Carga el registro central de quests, gestiona su ciclo de vida y
 * reacciona a eventos del juego para avanzar steps.
 *
 * Ciclo de vida de una quest:
 *   offered  ->  active  ->  completed
 *                     \->  declined (offshoot de offered)
 *
 * Cada quest tiene:
 *   - id, branch, title, description
 *   - prerequisites: { quests:[], affinities:{}, items:[] }
 *   - steps: array de nodos { id, type, ... } (ver tipos en data/quests/*)
 *   - rewards: { gold, items, affinity, skillXP }
 *
 * Métodos principales:
 *   - loadAll()
 *   - isAvailable(questId)         - prereqs OK y aún no tomada/completada
 *   - getAvailableForNPC(npcId)     - quests que ese NPC puede ofrecer
 *   - offerQuest(id) / acceptQuest(id) / declineQuest(id)
 *   - progressQuest(id)            - avanza un step
 *   - progressQuestByEvent(type, payload)  - dispatcher genérico
 *   - completeQuest(id)            - otorga recompensas
 *
 * Eventos que ESCUCHA (en bindEvents):
 *   - npcInteracted  { npc }
 *   - enemyDefeated  { enemyId }
 *   - itemCollected  { itemId, quantity }
 *   - locationReached{ sceneId, x, y }
 *   - minigameEnded  { game, result }
 *   - choiceMade     { stepId, optionId }
 *   - questAccepted  { questId }
 */

const STATE = {
	OFFERED: 'offered',
	ACTIVE: 'active',
	COMPLETED: 'completed',
	DECLINED: 'declined',
}

export class QuestManager {
	constructor(game) {
		this.game = game
		this.player = game.player
		this.eventSystem = game.eventSystem

		/** Registro completo inmutable (copia de QUESTS). */
		this.registry = new Map()

		/** questId -> { id, state, currentStep, ...config } */
		this.activeQuests = new Map()

		/** Quests terminadas (exitosamente). */
		this.completedQuests = new Set()

		/** Quests rechazadas por el jugador (no se vuelven a ofrecer). */
		this.declinedQuests = new Set()

		this.loadAll()
	}

	/* ============================================================
	 * Carga / Registro
	 * ============================================================ */

	loadAll() {
		for (const [id, config] of Object.entries(QUESTS)) {
			this.register(config)
		}
	}

	/** Registra una quest en el manager (la pone disponible para ofrecerse). */
	register(config) {
		if (!config?.id) {
			console.warn('[QuestManager] Quest sin id, ignorada:', config)
			return
		}
		this.registry.set(config.id, config)
		// Si la quest es autoStart, la activamos al registrarla.
		// Pero sólo si sus prerequisites se cumplen en este momento.
		if (config.autoStart && this.checkPrerequisites(config)) {
			this.startQuest(config.id)
		}
	}

	getById(id) {
		return this.registry.get(id) ?? null
	}

	/* ============================================================
	 * Consultas
	 * ============================================================ */

	/**
	 * ¿La quest está disponible para iniciarse?
	 * - No está ya activa, completada ni rechazada.
	 * - Sus prerequisites se cumplen.
	 */
	isAvailable(questId) {
		if (this.activeQuests.has(questId)) return false
		if (this.completedQuests.has(questId)) return false
		if (this.declinedQuests.has(questId)) return false

		const config = this.getById(questId)
		if (!config) return false
		return this.checkPrerequisites(config)
	}

	/** ¿Las prerequisites de esta quest se cumplen AHORA? */
	checkPrerequisites(config) {
		const prereqs = config.prerequisites ?? {}
		const affinityMgr = this.game.affinityManager

		// Quests previas completadas.
		for (const qId of prereqs.quests ?? []) {
			if (!this.completedQuests.has(qId)) return false
		}

		// Afinidad mínima por rama.
		for (const [branch, level] of Object.entries(prereqs.affinities ?? {})) {
			if (!affinityMgr.meets(branch, level)) return false
		}

		// Items requeridos en el inventario del jugador.
		for (const itemReq of prereqs.items ?? []) {
			if (!this.playerHasItem(itemReq.id, itemReq.quantity ?? 1)) {
				return false
			}
		}

		return true
	}

	playerHasItem(itemId, quantity = 1) {
		if (!this.player?.inventory) return false
		const flat = this.player.inventory.slots?.flat() ?? []
		let total = 0
		for (const slot of flat) {
			if (slot?.item?.id === itemId) total += slot.quantity ?? 0
		}
		return total >= quantity
	}

	/** Quests que un NPC concreto puede ofrecer (cumplen prereqs). */
	getAvailableForNPC(npcId) {
		const result = []
		for (const [id, config] of this.registry) {
			if (!config.offeredBy?.includes(npcId)) continue
			if (this.isAvailable(id)) result.push(id)
		}
		return result
	}

	getActiveQuests() {
		return Array.from(this.activeQuests.values()).filter(
			(q) => q.state === STATE.ACTIVE
		)
	}

	getQuestState(questId) {
		if (this.completedQuests.has(questId)) {
			return { state: STATE.COMPLETED, currentStep: null }
		}
		if (this.declinedQuests.has(questId)) {
			return { state: STATE.DECLINED, currentStep: null }
		}
		return this.activeQuests.get(questId) ?? null
	}

	/* ============================================================
	 * Ciclo de vida
	 * ============================================================ */

	/**
	 * Inicia una quest directamente como ACTIVA.
	 * Usado por autoStart y por la mecánica de aceptar oferta.
	 */
	startQuest(questId) {
		if (this.activeQuests.has(questId) || this.completedQuests.has(questId)) {
			return false
		}
		const config = this.getById(questId)
		if (!config) return false

		this.activeQuests.set(questId, {
			...config,
			state: STATE.ACTIVE,
			currentStep: 0,
			isCompleted: false,
		})
		this.eventSystem.emit('questStarted', { questId, quest: config })
		return true
	}

	/** Marca la quest como ofrecida (aún no aceptada). */
	offerQuest(questId) {
		if (!this.isAvailable(questId)) return false
		const config = this.getById(questId)
		this.activeQuests.set(questId, {
			...config,
			state: STATE.OFFERED,
			currentStep: 0,
			isCompleted: false,
		})
		this.eventSystem.emit('questOffered', { questId, quest: config })
		return true
	}

	acceptQuest(questId) {
		const quest = this.activeQuests.get(questId)
		if (!quest || quest.state !== STATE.OFFERED) return false
		quest.state = STATE.ACTIVE
		this.eventSystem.emit('questAccepted', { questId, quest })
		return true
	}

	declineQuest(questId) {
		const quest = this.activeQuests.get(questId)
		if (!quest) return false
		quest.state = STATE.DECLINED
		this.activeQuests.delete(questId)
		this.declinedQuests.add(questId)
		this.eventSystem.emit('questDeclined', { questId, quest })
		return true
	}

	/** Avanza la quest un step (genérico, sin chequear tipo). */
	progressQuest(questId) {
		const quest = this.activeQuests.get(questId)
		if (!quest || quest.state !== STATE.ACTIVE) return false

		quest.currentStep += 1

		if (quest.currentStep >= quest.steps.length) {
			this.completeQuest(questId)
		} else {
			this.eventSystem.emit('questStepAdvanced', { questId, quest })
		}
		return true
	}

	/** Marca la quest como completada y otorga recompensas. */
	completeQuest(questId) {
		const quest = this.activeQuests.get(questId)
		if (!quest) return false

		quest.state = STATE.COMPLETED
		quest.isCompleted = true
		this.completedQuests.add(questId)
		this.activeQuests.delete(questId)

		this.applyRewards(quest)
		this.eventSystem.emit('questCompleted', { questId, quest })
		return true
	}

	/* ============================================================
	 * Recompensas
	 * ============================================================ */

	applyRewards(quest) {
		const r = quest.rewards ?? {}
		if (r.gold) {
			this.player.resources.gold = (this.player.resources.gold ?? 0) + r.gold
		}
		if (r.affinity) {
			for (const [branch, val] of Object.entries(r.affinity)) {
				this.game.affinityManager.addAffinity(branch, val)
			}
		}
		if (r.skillXP) {
			for (const [skill, val] of Object.entries(r.skillXP)) {
				this.game.skillManager.addXP(skill, val)
			}
		}
		if (r.items) {
			for (const it of r.items) {
				const item = this.game.itemsManager.getItem(it.id)
				if (item) this.player.inventory.addItem(item, it.quantity ?? 1, this.player)
			}
		}
	}

	/**
	 * Aplica una "effect" producido por un step (choice, reward, etc.).
	 * Mantiene una sola implementación para todos los effects del sistema.
	 */
	applyEffect(effect) {
		if (!effect?.type) return
		switch (effect.type) {
			case 'affinity':
				this.game.affinityManager.addAffinity(effect.branch, effect.val)
				break
			case 'skillXP':
				this.game.skillManager.addXP(effect.skill, effect.val)
				break
			case 'gold':
				this.player.resources.gold =
					(this.player.resources.gold ?? 0) + (effect.amount ?? 0)
				break
			case 'item': {
				const item = this.game.itemsManager.getItem(effect.itemId)
				if (item) {
					this.player.inventory.addItem(
						item,
						effect.quantity ?? 1,
						this.player
					)
				}
				break
			}
			case 'startQuest':
				this.startQuest(effect.questId)
				break
			case 'progressQuest':
				this.progressQuest(effect.questId)
				break
			case 'flag':
				// Stub: persistir flags del jugador si se desea guardar.
				break
			default:
				console.warn('[QuestManager] Effect desconocido:', effect)
		}
	}

	/* ============================================================
	 * Dispatcher por evento
	 * ============================================================ */

	/**
	 * Procesa un evento del juego y avanza todas las quests activas cuyo
	 * step actual coincida con el tipo + payload.
	 *
	 * @param {string} eventType
	 * @param {Object} payload
	 */
	progressQuestByEvent(eventType, payload = {}) {
		for (const [questId, quest] of this.activeQuests) {
			if (quest.state !== STATE.ACTIVE) continue
			const step = quest.steps[quest.currentStep]
			if (!step) continue
			if (step.type !== eventType) continue

			if (this.stepMatches(step, payload)) {
			// Step de "choice" aplica los effects directamente, no avanza solo.
			if (step.type === 'choice') {
				const option = step.options?.find((o) => o.id === payload.optionId)
				if (option) {
					// 1) Aplicar effects.
					;(option.effects ?? []).forEach((e) => this.applyEffect(e))
					// 2) Avanzar la quest (la marca como completada si era el
					//    último step) ANTES de evaluar los unlockQuests para que
					//    las dependencias vean el estado actualizado.
					this.progressQuest(questId)
					// 3) Desbloquear las quests asociadas (pueden depender de
					//    que esta quest esté completada).
					;(option.unlockQuests ?? []).forEach((qid) =>
						this.startQuest(qid)
					)
				}
			} else {
				this.progressQuest(questId)
			}
			}
		}
	}

	/** ¿El payload del evento satisface las condiciones del step? */
	stepMatches(step, payload) {
		switch (step.type) {
			case 'talk':
				return payload.npcId === step.npcId
			case 'collect':
				return this.playerHasItem(step.itemId, step.quantity ?? 1)
			case 'defeat':
				return payload.enemyId === step.enemyId
			case 'reach': {
				if (payload.sceneId !== step.sceneId) return false
				const dx = (payload.x ?? 0) - step.x
				const dy = (payload.y ?? 0) - step.y
				return Math.hypot(dx, dy) <= (step.radius ?? 50)
			}
			case 'minigame':
				return payload.game === step.game
			case 'choice':
				return !!payload.optionId
			default:
				return false
		}
	}

	/* ============================================================
	 * Suscripción a eventos globales
	 * ============================================================ */

	bindEvents() {
		this.eventSystem.on('npcInteracted', ({ npc }) => {
			// Auto-arranque: si el NPC ofrece quests disponibles y no
			// están activas aún, las iniciamos automáticamente.
			if (npc?.questCapability?.offerableQuests) {
				for (const qId of npc.questCapability.offerableQuests) {
					if (this.isAvailable(qId)) this.startQuest(qId)
				}
			}

			// Compatibilidad hacia atrás: si el NPC tiene questId directo.
			if (npc?.questId) {
				this.progressQuest(npc.questId)
			}
			// Nueva mecánica: dispara el dispatcher por evento.
			this.progressQuestByEvent('talk', { npcId: npc?.id })
		})

		this.eventSystem.on('enemyDefeated', (data) => {
			this.progressQuestByEvent('defeat', data)
		})

		this.eventSystem.on('itemCollected', (data) => {
			this.progressQuestByEvent('collect', data)
		})

		this.eventSystem.on('locationReached', (data) => {
			this.progressQuestByEvent('reach', data)
		})

		this.eventSystem.on('minigameEnded', (data) => {
			this.progressQuestByEvent('minigame', data)
		})

		this.eventSystem.on('choiceMade', (data) => {
			this.progressQuestByEvent('choice', data)
		})
	}
}
