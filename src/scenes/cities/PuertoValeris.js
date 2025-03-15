// src/scenes/ValerisScene.js
import { Camera } from '../../core/Camera.js'
import { UIManager } from '../../core/managers/UIManager.js'

import { NPC } from '../../entities/npcs/NPC.js'
import { Button } from '../../components/Button.js'

import { SCENES } from '../../core/constants.js'

import { DialogManager } from './DialogManager.js'

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
		this.mapWidth = 1980
		this.mapHeight = 1080
		this.camera.setMapBounds(this.mapWidth, this.mapHeight)

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
		// Gestor de diálogos
		this.dialogManager = new DialogManager(this.game)

		// Suscripcion a eventos
		this.game.eventSystem.on('npcInteracted', ({ npc }) => {
			this.dialogManager.startDialogue(npc)
		})
		this.game.eventSystem.on('interactionEnded', ({ npc }) => {
			console.log(`Fin de interacción con NPC en (${npc.x}, ${npc.y})`)
		})
		this.game.eventSystem.on('dialogEnded', () => {
			console.log('Diálogo finalizado')
		})
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
					} else {
						// si ya esta interaccionando al presionar
						this.dialogManager.advanceDialogue()
					}
				}
			} else {
				// Si el jugador se aleja, finalizar la interacción
				if (npc.isInteracting) {
					this.dialogManager.endDialogue()
				}
			}
		}

		// Manejar entrada para selección de opciones
		if (this.dialogManager.currentNPC) {
			if (this.keys['w'] && !this.keyPressed) {
				this.keyPressed = true
				this.dialogManager.selectedOptionIndex = Math.max(
					0,
					this.dialogManager.selectedOptionIndex - 1
				)
			} else if (this.keys['s'] && !this.keyPressed) {
				this.keyPressed = true
				const currentDialog =
					this.dialogManager.currentNPC.dialogs[
						this.dialogManager.currentMessageIndex
					]
				if (currentDialog?.options) {
					this.dialogManager.selectedOptionIndex = Math.min(
						currentDialog.options.length - 1,
						this.dialogManager.selectedOptionIndex + 1
					)
				}
			} else if (this.keys['q'] && !this.keyPressed) {
				this.keyPressed = true
				this.dialogManager.selectOption(this.dialogManager.selectedOptionIndex)
			}
		}

		if (
			!this.keys['w'] &&
			!this.keys['s'] &&
			!this.keys['q'] &&
			!this.keys['e']
		) {
			this.keyPressed = false
		}
	}

	render() {
		const { ctx } = this.game

		// Dibujar NPCs
		this.npcs.forEach((npc) => npc.draw(ctx, this.camera))

		this.game.player.draw(ctx, this.camera)

		// Renderizar UI
		this.uiManager.renderComponents(ctx)

		// Renderizar diálogo activo
		if (this.dialogManager.currentNPC) {
			const dialog =
				this.dialogManager.currentNPC.dialogs[
					this.dialogManager.currentMessageIndex
				]
			// console.log(dialog, typeof dialog)
			if (typeof dialog === 'string') {
				this.dialogManager.renderDialogBox(dialog)
			} else if (dialog?.options) {
				this.dialogManager.renderDialogBox(dialog.message)
				this.dialogManager.renderOptionsBox(dialog.options)
			}
		}
	}

	/* Load/Unload */
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

	/* Events */
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
}
