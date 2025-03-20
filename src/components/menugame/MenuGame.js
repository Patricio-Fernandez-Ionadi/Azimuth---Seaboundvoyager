import { Text } from '../Text.js'

const TABS = ['Inventario', 'Crear', 'Estadisticas', 'Logros']
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
		this.hidden = { x: this.game.width + 10 }
		this.opened = { x: this.game.width * 0.05 }
		this.x = this.hidden.x
		this.y = this.game.height * 0.05
		this.container = {
			header: {
				height: 60,
				tab: { width: this.width / this.tabs.length },
			},
			content: {},
		}

		this.game.eventSystem.on('toggle_menugame', () => {
			this.isOpen = !this.isOpen
			this.slide()
			// Calcular dimensiones del contenedor del menú
			this.#calculateContainerDimensions()

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
		})
		// setTimeout(() => this.game.eventSystem.emit('toggle_menugame'), 500)
	}

	render() {
		if (!this.isOpen) return
		this.#container()
		this.#header()
		this.#menuContent()
	}

	slide() {
		// if (this.isOpen) {
		// 	while (this.x < this.hidden.x) this.x++
		// 	if (this.x >= this.hidden.x) this.isOpen = false
		// } else {
		// 	while (this.x > this.hidden.x) this.x++
		// }
	}

	mouseDown(mouseX, mouseY, e) {
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
			mouseY < trashY + trashSize
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

		this.c.fillStyle = '#ff000055' // Rojo para el área de estadísticas
		this.c.fillRect(x, y, width, height)

		// Ejemplo: Barra de salud
		const healthBarX = x + width * 0.1
		const healthBarY = y + height * 0.1
		const healthBarWidth = width * 0.8
		const healthBarHeight = 20

		this.c.fillStyle = '#00ff00' // Verde para la barra de salud
		this.c.fillRect(
			healthBarX,
			healthBarY,
			healthBarWidth * 0.75,
			healthBarHeight
		) // 75% de salud

		this.c.strokeStyle = '#ffffff'
		this.c.strokeRect(healthBarX, healthBarY, healthBarWidth, healthBarHeight)

		Text({
			ctx: this.c,
			x: healthBarX + healthBarWidth / 2,
			y: healthBarY + healthBarHeight + 20,
			size: 24,
			label: 'Salud: 75%',
			align: 'center',
		})
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
