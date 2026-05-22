const mentorQuest = {
  id: 'mentor_intro',
  title: 'Aprende lo básico',
  steps: [
    { type: 'talk', npc: 'mentor', text: 'Habla con el mentor.' },
    {
      type: 'move',
      location: { x: 10, y: 5 },
      text: 'Ve al punto de entrenamiento.',
    },
    { type: 'fight', enemy: 'dummy', text: 'Derrota al muñeco de práctica.' },
  ],
}

export class QuestManager {
  constructor(game) {
    this.game = game
    this.player = game.player
    this.eventSystem = game.eventSystem

    // this.lastIndexInteraction = 0
    // this.mentorSage = 1

    this.activeQuests = new Map() // questId -> questState
    this.completedQuests = new Set()
  }

  /**
   * Inicia una nueva quest si no está ya activa o completada
   */
  startQuest(questConfig) {
    if (
      this.activeQuests.has(questConfig.id) ||
      this.completedQuests.has(questConfig.id)
    ) {
      return
    }

    this.activeQuests.set(questConfig.id, {
      ...questConfig,
      currentStep: 0,
      isCompleted: false,
    })
  }

  /**
   * Avanza la quest según una condición cumplida (ej: hablar con NPC)
   */
  progressQuest(questId) {
    const quest = this.activeQuests.get(questId)
    if (!quest || quest.isCompleted) return

    quest.currentStep++

    if (quest.currentStep >= quest.steps.length) {
      this.completeQuest(questId)
    }
  }

  completeQuest(questId) {
    const quest = this.activeQuests.get(questId)
    if (!quest) return

    quest.isCompleted = true
    this.completedQuests.add(questId)
    this.activeQuests.delete(questId)

    // Notificar al sistema de eventos
    this.eventSystem.emit('questCompleted', { questId, quest })
  }

  /**
   * Devuelve el estado actual de una quest
   */
  getQuestState(questId) {
    return (
      this.activeQuests.get(questId) || {
        isCompleted: this.completedQuests.has(questId),
        currentStep: null,
      }
    )
  }

  /**
   * Vincular con el eventSystem global
   */
  bindEvents() {
    this.eventSystem.on('npcInteracted', (npc) => {
      // Ejemplo: si el NPC tiene una quest asociada
      if (npc.questId) {
        this.progressQuest(npc.questId)
      }
    })

    this.eventSystem.on('enemyDefeated', (enemy) => {
      // Lógica para quests de "matar X enemigos"
    })
  }
}
