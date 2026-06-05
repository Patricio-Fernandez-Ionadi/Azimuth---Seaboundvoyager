import { Text } from '../Text.js'

const TABS = ['Inventario', 'Crear', 'Estadisticas', 'Misiones', 'Logros']
export class MenuGame {
  constructor(player) {
    this.player = player
    this.game = player.game
    this.c = player.game.ctx
    this.isOpen = false
    this.tabs = TABS
    this.defaultSelected = this.tabs[0]
    this.selectedTab = this.defaultSelected
    this.width = this.game.width * 0.9
    this.height = this.game.height * 0.9
    this.x = this.game.width * 0.05
    this.y = this.game.height * 0.05
    this.container = {
      header: {
        height: 60,
        tab: { width: this.width / this.tabs.length },
      },
      content: {},
    }
    this.targetX = this.game.width * 0.05
    this.currentX = this.game.width
    this.animationSpeed = 45

    this.game.eventSystem.on('toggle_menugame', () => {
      this.toggle()
    })
  }

  update() {
    if (this.isOpen) {
      // Animación para abrir el menú
      if (this.currentX > this.targetX) {
        this.currentX -= this.animationSpeed
      }
    } else {
      // Animación para cerrar el menú
      // if (this.currentX < this.x + this.width + 20) {
      if (this.currentX < this.game.width + 10) {
        this.currentX += this.animationSpeed
      }
    }
  }

  render() {
    this.c.save()
    this.c.translate(this.currentX, 0)
    this.#container()
    this.#header()
    this.#menuContent()
    this.c.restore()
  }

  toggle() {
    this.isOpen = !this.isOpen

    if (this.isOpen) {
      const rows = 10
      const cols = 8
      const slotSize = this.container.content.height / rows

      this.player.inventory.slotSize = slotSize
      this.player.inventory.y = this.y + 60
      this.player.inventory.x = this.x + this.width - slotSize * cols

      this.player.inventory.setGrid(rows, cols)
    } else {
      this.player.inventory.x = 435
      this.player.inventory.y = 20
      this.player.inventory.slotSize = 40
      this.player.inventory.setGrid(10, 8)
    }
  }

  mouseDown(mouseX, mouseY, e) {
    if (!this.isOpen) return
    const tabWidth = this.container.header.tab.width
    const tabHeight = this.container.header.height

    this.tabs.forEach((t, idx) => {
      const tabX = this.game.width * 0.05 + tabWidth * idx
      const tabY = this.game.height * 0.05

      if (
        mouseX >= tabX &&
        mouseX <= tabX + tabWidth &&
        mouseY >= tabY &&
        mouseY <= tabY + tabHeight
      ) {
        this.selectedTab = t
      }
    })
  }
  mouseMove(mouseX, mouseY, e) {
    /* CODE FOR CHECK HOVER */
    // let mouseOverMenu =
    // 	mouseX > this.x &&
    // 	mouseX < this.x + this.width &&
    // 	mouseY > this.y &&
    // 	mouseY < this.y + this.height
    // if (mouseOverMenu) {}
  }
  mouseUp(mouseX, mouseY, e) {
    const trashSize = 64
    const trashX = this.player.inventory.x - trashSize
    const trashY = this.container.content.y

    if (
      mouseX > trashX &&
      mouseX < trashX + trashSize &&
      mouseY > trashY &&
      mouseY < trashY + trashSize &&
      this.selectedTab === this.tabs[0]
    ) {
      console.log('soltado en trash')
    }
  }

  #container() {
    this.c.fillStyle = '#00000055'
    this.c.fillRect(this.x, this.y, this.width, this.height)
  }
  #header() {
    this.c.fillStyle = '#00ff0055'
    this.c.fillRect(this.x, this.y, this.width, this.container.header.height)
    this.#createTabs()
  }
  #createTabs() {
    this.tabs.forEach((t, idx) => {
      // Resaltar la pestaña activa
      // Rojo para la pestaña seleccionada
      if (this.selectedTab === t) this.c.fillStyle = '#ff000055'
      // Azul para las pestañas inactivas
      else this.c.fillStyle = '#0000ff55'

      const tabX = this.x + this.container.header.tab.width * idx
      this.c.fillRect(
        tabX,
        this.y,
        this.container.header.tab.width,
        this.container.header.height
      )
      Text({
        ctx: this.c,
        x: tabX + this.container.header.tab.width / 3.8, // buscar forma de centrar
        y: this.y + this.container.header.height / 2 + 8,
        size: 24,
        label: t,
      })
    })
  }
  #menuContent() {
    this.container.content.y = this.y + this.container.header.height
    // const contentY = this.y + this.container.header.height
    this.container.content.height = this.height - this.container.header.height

    // Fondo del área de contenido
    this.c.fillStyle = '#ffffff33' // Blanco semi-transparente
    this.c.fillRect(
      this.x,
      this.container.content.y,
      this.width,
      this.container.content.height
    )

		// Mostrar contenido según la pestaña seleccionada
		switch (this.selectedTab) {
			case 'Inventario':
				this.#drawInventoryContent()
				break
			case 'Crear':
				this.#drawCraftingContent()
				break
			case 'Estadisticas':
				this.#drawStatsContent()
				break
			case 'Misiones':
				this.#drawQuestsContent()
				break
			case 'Logros':
				this.#drawAchievementsContent()
				break
			default:
				break
		}
	}

  #drawInventoryContent() {
    const y = this.container.content.y

    // box for drop items
    this.c.fillStyle = 'red'
    const trashSize = 64
    const trashX = this.x + 340
    const trashY = y + 20
    this.c.fillRect(trashX, trashY, trashSize, trashSize)

    this.player.inventory.draw(this.c)
  }
  #drawCraftingContent() {
    const x = this.x
    const y = this.container.content.y
    const height = this.container.content.height

    this.c.fillStyle = '#00ffff55' // Azul cian para el área de crafteo
    this.c.fillRect(x, y, this.width, height)

    // Ejemplo: Área de entrada para materiales
    const inputAreaX = x + this.width * 0.1
    const inputAreaY = y + height * 0.1
    const inputAreaSize = 100

    this.c.fillStyle = '#ff00ff55' // Magenta para resaltar áreas interactivas
    this.c.fillRect(inputAreaX, inputAreaY, inputAreaSize, inputAreaSize)

    // Ejemplo: Botón de "Crear"
    const buttonX = x + this.width - 170
    const buttonY = y + height - 70
    const buttonWidth = 150
    const buttonHeight = 50

    this.c.fillStyle = '#ffff0055' // Amarillo para el botón
    this.c.fillRect(buttonX, buttonY, buttonWidth, buttonHeight)

    Text({
      ctx: this.c,
      x: buttonX + buttonWidth / 2,
      y: buttonY + buttonHeight / 2 + 8,
      size: 24,
      label: 'Crear',
      align: 'center',
    })
  }
	#drawStatsContent() {
		const x = this.x
		const y = this.container.content.y
		const height = this.container.content.height
		const width = this.width

		// Fondo
		this.c.fillStyle = '#1a1a1a99'
		this.c.fillRect(x, y, width, height)

		const p = this.player
		const labelSize = 18
		const valueSize = 18
		const rowHeight = 38
		const colWidth = width / 2

		// Título: Habilidades
		Text({
			ctx: this.c,
			x: x + 20,
			y: y + 30,
			size: 22,
			label: 'Habilidades',
			align: 'left',
		})

		// Cada skill con su barra
		const skills = p.skills ?? {}
		const skillKeys = Object.keys(skills)
		skillKeys.forEach((key, i) => {
			const s = skills[key]
			const rowY = y + 60 + i * rowHeight
			const barX = x + 20
			const barW = colWidth - 40
			const barH = 16

			Text({
				ctx: this.c,
				x: barX,
				y: rowY,
				size: labelSize,
				label: this.#formatKey(key),
				align: 'left',
			})

			// barra de progreso (0-100)
			this.c.fillStyle = '#333333'
			this.c.fillRect(barX, rowY + 4, barW, barH)
			this.c.fillStyle = '#3aa0ff'
			this.c.fillRect(barX, rowY + 4, barW * (s.value / 100), barH)

			Text({
				ctx: this.c,
				x: barX + barW + 10,
				y: rowY + 4,
				size: valueSize,
				label: `${s.value}`,
				align: 'left',
			})
		})

		// Título: Afinidad
		const affinitiesStartY = y + 60 + skillKeys.length * rowHeight + 20
		Text({
			ctx: this.c,
			x: x + 20,
			y: affinitiesStartY,
			size: 22,
			label: 'Afinidad',
			align: 'left',
		})

		const aff = p.affinities ?? {}
		const affKeys = Object.keys(aff)
		affKeys.forEach((key, i) => {
			const value = aff[key]
			const rowY = affinitiesStartY + 30 + i * rowHeight
			const isMain = p.mainAffinity === key
			const isSecondary = p.secondaryAffinity === key

			Text({
				ctx: this.c,
				x: x + 20,
				y: rowY,
				size: labelSize,
				label: this.#formatKey(key) + (isMain ? ' (principal)' : isSecondary ? ' (secundaria)' : ''),
				align: 'left',
			})

			// 10 niveles
			for (let lvl = 0; lvl < 10; lvl++) {
				const cx = x + 220 + lvl * 18
				const cy = rowY + 4
				this.c.fillStyle = lvl < value ? this.#affinityColor(key) : '#333'
				this.c.fillRect(cx, cy, 14, 14)
			}
		})
	}

	/** Dibuja la pestaña de Misiones (quests activas y completadas). */
	#drawQuestsContent() {
		const x = this.x
		const y = this.container.content.y
		const width = this.width
		const height = this.container.content.height

		this.c.fillStyle = '#1a1a1a99'
		this.c.fillRect(x, y, width, height)

		const qm = this.game.questManager
		const active = qm?.getActiveQuests?.() ?? []
		const completed = Array.from(qm?.completedQuests ?? [])

		let rowY = y + 30
		const rowHeight = 60
		const padX = x + 20

		Text({
			ctx: this.c,
			x: padX,
			y: rowY,
			size: 22,
			label: 'Misiones activas',
			align: 'left',
		})
		rowY += 30

		if (active.length === 0) {
			Text({
				ctx: this.c,
				x: padX,
				y: rowY,
				size: 16,
				label: 'No hay misiones activas.',
				align: 'left',
			})
			rowY += rowHeight
		} else {
			active.forEach((q) => {
				Text({
					ctx: this.c,
					x: padX,
					y: rowY,
					size: 18,
					label: `• ${q.title} (${q.branch})`,
					align: 'left',
				})
				const step = q.steps?.[q.currentStep]
				if (step?.description) {
					Text({
						ctx: this.c,
						x: padX + 20,
						y: rowY + 22,
						size: 14,
						label: `   → ${step.description}`,
						align: 'left',
					})
				}
				rowY += rowHeight
			})
		}

		rowY += 20
		Text({
			ctx: this.c,
			x: padX,
			y: rowY,
			size: 22,
			label: 'Misiones completadas',
			align: 'left',
		})
		rowY += 30
		if (completed.length === 0) {
			Text({
				ctx: this.c,
				x: padX,
				y: rowY,
				size: 16,
				label: '—',
				align: 'left',
			})
		} else {
			completed.forEach((qId) => {
				const q = qm.getById(qId)
				Text({
					ctx: this.c,
					x: padX,
					y: rowY,
					size: 16,
					label: `✓ ${q?.title ?? qId}`,
					align: 'left',
				})
				rowY += 26
			})
		}
	}

	/** Capitaliza y traduce nombres de keys (camelCase -> "Camel Case"). */
	#formatKey(key) {
		const map = {
			perspicacia: 'Perspicacia',
			negociacion: 'Negociación',
			destreza: 'Destreza',
			rebeldia: 'Rebeldía',
			prestigio: 'Prestigio',
			asombro: 'Asombro',
		}
		return map[key] ?? key
	}

	/** Color asociado a cada afinidad. */
	#affinityColor(key) {
		const colors = {
			rebeldia: '#c0392b',
			prestigio: '#f1c40f',
			asombro: '#9b59b6',
		}
		return colors[key] ?? '#888'
	}
  #drawAchievementsContent() {
    const x = this.x
    const y = this.container.content.y
    const height = this.container.content.height
    const width = this.width

    this.c.fillStyle = '#ffffff55' // Blanco semi-transparente
    this.c.fillRect(x, y, width, height)

    // Ejemplo: Lista de logros
    const achievements = ['Explorador', 'Artesano', 'Héroe']
    achievements.forEach((achievement, idx) => {
      const textY = y + idx * 40 + 40
      Text({
        ctx: this.c,
        x: x + width * 0.1,
        y: textY,
        size: 24,
        label: achievement,
        align: 'left',
      })
    })
  }

  #calculateContainerDimensions() {
    this.width = this.game.width * 0.9
    this.height = this.game.height * 0.9
    this.x = this.game.width * 0.05
    this.y = this.game.height * 0.05

    this.container = {
      header: {
        height: 60,
        tab: { width: this.width / this.tabs.length },
      },
      content: {
        y: this.y + 60, // Header height
        height: this.height - 60, // Remaining height
      },
    }
  }
}
