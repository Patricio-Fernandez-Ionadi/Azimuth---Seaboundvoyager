// src/scenes/ValerisScene.js
import { Camera } from '../../core/Camera.js'
import { UIManager } from '../../core/managers/UIManager.js'

import { NPC } from '../../entities/npcs/NPC.js'
import { Button } from '../../components/Button.js'

import { SCENES } from '../../core/constants.js'

const NPCS = [
	new NPC(200, 200, 'blue', [
		'¡Bienvenido a Puerto Valeris!',
		'¿Necesitas algo, marinero?',
		'Puedo ofrecerte algunos suministros.',
		'¡Buena suerte en tu viaje!',
	]),
	new NPC(300, 300, 'green', [
		'Hola, forastero.',
		'Este lugar es peligroso.',
		'Ten cuidado con los piratas.',
	]),
	new NPC(100, 200, 'yellow', [
		'¡Bienvenido a mi tienda!',
		{
			message: 'Puedo ofrecerte algunos suministros.',
			options: [
				{
					text: 'Comerciar',
					callback: () => console.log('Abrir ventana de comercio'),
				},
				{ text: 'Salir', callback: () => console.log('Salir del diálogo') },
			],
		},
	]),
]

export class PuertoValerisScene {
	constructor(game) {
		this.game = game
		this.keys = this.game.keys
		this.uiManager = new UIManager(this.game)

		this.camera = new Camera(this.game)
		this.mapWidth = 1980 // Ancho del mapa
		this.mapHeight = 1080 // Altura del mapa
		this.camera.setMapBounds(this.mapWidth, this.mapHeight)

		// NPCs específicos de esta ciudad
		this.npcs = NPCS.map(
			(npcData) =>
				new NPC(
					npcData.x,
					npcData.y,
					npcData.color,
					npcData.dialogs,
					this.game.eventSystem
				)
		)

		// Estado para la selección de opciones
		this.selectedOptionIndex = 0
		this.keyPressed = false
		this.currentNPCWithOptions = null

		// Suscribirse a eventos
		this.game.eventSystem.on('npcInteracted', ({ npc }) => {
			console.log(`Interactuando con NPC en (${npc.x}, ${npc.y})`)
		})

		this.game.eventSystem.on('optionSelected', ({ npc, option }) => {
			console.log(`Opción seleccionada: ${option.text}`)
		})

		this.game.eventSystem.on('interactionEnded', ({ npc }) => {
			console.log(`Fin de interacción con NPC en (${npc.x}, ${npc.y})`)
		})
	}

	onEnter() {
		console.log('Entrando en la escena: Puerto Valeris')
		// Configurar la cámara para seguir al jugador
		if (this.game.player && this.camera.target !== this.game.player) {
			this.camera.setTarget(this.game.player)
		}

		this.map_button = new Button(
			this.game.width - 70,
			this.game.height - 70,
			50,
			50,
			'Map',
			20,
			5,
			32
		)
		this.map_button.onClick = () => {
			this.game.sceneManager.changeScene(SCENES.map)
		}
		this.uiManager.addComponent(this.map_button)
	}

	onExit() {
		console.log('Saliendo de la escena: Puerto Valeris')
	}

	handleClick(mouseX, mouseY, e) {
		const camX = mouseX + this.camera.x
		const camY = mouseY + this.camera.y

		// Verificar si el jugador hizo clic en un NPC
		for (const npc of this.npcs) {
			if (
				camX >= npc.x &&
				camX <= npc.x + npc.width &&
				camY >= npc.y &&
				camY <= npc.y + npc.height
			) {
				npc.interact(this.player)
				return
			}
		}
		this.uiManager.handleClick(mouseX, mouseY, e)
	}
	mouseMove(mouseX, mouseY, e) {
		this.map_button.handleHover(mouseX, mouseY, e)
	}

	render() {
		const { ctx } = this.game

		// Dibujar NPCs
		this.npcs.forEach((npc) => npc.draw(ctx, this.camera))

		this.game.player.draw(ctx, this.camera)

		// Renderizar UI
		this.uiManager.renderComponents(ctx)

		// Renderizar diálogo activo
		this.renderActiveDialog()
	}

	update(deltatime) {
		this.game.player.update(this.keys)
		this.camera.update()

		// Verificar interacción con NPCs
		for (const npc of this.npcs) {
			const playerX = this.game.player.x + this.game.player.width / 2
			const playerY = this.game.player.y + this.game.player.height / 2

			let canTalk =
				Math.abs(playerX - npc.x) < 50 && Math.abs(playerY - npc.y) < 50 // Jugador cerca del NPC

			// Verificar si el jugador está frente al NPC
			if (canTalk) {
				if (this.keys['e'] && !this.keyPressed) {
					this.keyPressed = true
					if (!npc.isInteracting) {
						npc.interact()
					} else if (npc.waitingForInput) {
						npc.advanceDialogue()
					}
				}
			} else {
				// Si el jugador se aleja, finalizar la interacción
				if (npc.isInteracting) {
					npc.endInteraction()
				}
			}
		}

		// Manejar entrada para selección de opciones
		if (this.currentNPCWithOptions) {
			if (this.keys['w'] && !this.keyPressed) {
				this.keyPressed = true
				this.selectedOptionIndex = Math.max(0, this.selectedOptionIndex - 1)
			} else if (this.keys['s'] && !this.keyPressed) {
				this.keyPressed = true
				this.selectedOptionIndex = Math.min(
					this.currentNPCWithOptions.currentOptions.length - 1,
					this.selectedOptionIndex + 1
				)
			} else if (this.keys['Enter'] && !this.keyPressed) {
				this.keyPressed = true
				this.currentNPCWithOptions.selectOption(this.selectedOptionIndex)
				this.currentNPCWithOptions = null
				this.selectedOptionIndex = 0
			}
		}

		if (
			!this.keys['w'] &&
			!this.keys['s'] &&
			!this.keys['Enter'] &&
			!this.keys['e']
		) {
			this.keyPressed = false
		}
	}

	renderActiveDialog() {
		for (const npc of this.npcs) {
			if (npc.isInteracting) {
				const message = npc.getNextMessage()

				if (message) {
					this.showDialogBox(message)
					// Si hay opciones, mostramos el menú de selección
					if (npc.currentOptions) {
						this.currentNPCWithOptions = npc
						this.showOptionsBox(npc.currentOptions)
						return // No continuar hasta que se elija una opción
					}
				}
			}
		}
	}

	showOptionsBox(options) {
		const padding = 20
		const boxWidth = 400
		const boxHeight = 100 + options.length * 30
		const x = (this.game.width - boxWidth) / 2
		const y = this.game.height - boxHeight - padding

		// Dibujar el cuadro de opciones
		this.game.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
		this.game.ctx.fillRect(x, y, boxWidth, boxHeight)

		// Mostrar cada opción en pantalla
		options.forEach((option, index) => {
			this.game.ctx.fillStyle =
				this.selectedOptionIndex === index ? 'yellow' : 'white'
			this.game.ctx.font = '16px Arial'
			this.game.ctx.fillText(option.text, x + padding, y + padding + 30 * index)
		})
	}

	showDialogBox(message) {
		const padding = 20
		const boxWidth = 400
		const boxHeight = 100
		const x = (this.game.width - boxWidth) / 2
		const y = this.game.height - boxHeight - padding

		// Dibujar el cuadro de diálogo
		this.game.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
		this.game.ctx.fillRect(x, y, boxWidth, boxHeight)

		// Dibujar el texto
		this.game.ctx.fillStyle = 'white'
		this.game.ctx.font = '16px Arial'
		this.game.ctx.fillText(message, x + padding, y + padding + 20)
	}
}
