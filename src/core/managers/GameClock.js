export class GameClock {
	constructor(game) {
		this.game = game
		this.minutesPerRealSecond = 1 // 1 segundo real = 1 minuto en el juego
		this.gameDayDurationMinutes = 24 * 60 // Total de minutos en un día del juego
		this.gameDaySeconds = 6 * 60 // Iniciar a las 6:00 AM (en minutos)
		this.timeMultiplier = 0.4 // Multiplicador de velocidad del tiempo
		// this.timeMultiplier = 10

		this.deltatime = 0
		this.seconds = 0
		this.counter = 0
		this.fps = 0
		this.fpsCounter = 0
		this.aps = 0
		this.apsCounter = 0
		this.tick = 1 * 1000
		this.tickCounter = 0
		this.tickUpdate = false

		this.sesionSeconds = 0
	}

	getTime() {
		const totalMinutes = Math.floor(this.gameDaySeconds)
		const hours = Math.floor(totalMinutes / 60) % 24
		const minutes = totalMinutes % 60
		return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
			2,
			'0'
		)}`
	}

	update(dt) {
		this.#frameUpdate(dt)
		this.#tickPerSecond()
		this.#handleGameDayClock()
	}

	#handleGameDayClock() {
		// Convertir deltaTime de milisegundos a segundos
		const elapsedRealMs = (this.deltatime / 1000) * this.timeMultiplier
		const elapsedGameMinutes = elapsedRealMs * this.minutesPerRealSecond
		this.gameDaySeconds += elapsedGameMinutes
		this.currentHour = this.gameDaySeconds / 60

		// Reiniciar el ciclo si supera las 24 horas
		if (this.gameDaySeconds >= this.gameDayDurationMinutes) {
			this.gameDaySeconds -= this.gameDayDurationMinutes
			this.#triggerDailyEvents()
		}
	}
	#triggerDailyEvents() {
		console.log('Nuevo día en el juego!')
		// Ejemplo: Restablecer inventarios de tiendas
		// this.game.shops.forEach((shop) => shop.checkRestock(this.gameDaySeconds))
	}

	#frameUpdate(deltaTime) {
		this.deltatime = deltaTime
		// real world seconds
		this.seconds += this.deltatime / 1000
		this.sesionSeconds = Math.floor(this.seconds)

		if (this.counter > 1000) {
			this.fps = this.fpsCounter
			this.aps = this.apsCounter
			this.fpsCounter = 0
			this.apsCounter = 0
			this.counter = 0
			// console.log(`FPS: ${this.timer.fps} || APS: ${this.timer.aps}`)
			return true
		} else {
			this.counter += this.deltatime
			return false
		}
	}
	#tickPerSecond() {
		if (this.tickCounter > this.tick) {
			this.tickUpdate = true
			this.tickCounter = 0
		} else {
			this.tickUpdate = false
			this.tickCounter += this.deltatime
		}
	}
}
