export class GameClock {
	constructor(game) {
		this.game = game
		this.secondsPerRealSecond = 1 // 1 segundo real = 1 minuto en el juego
		this.totalGameMinutes = 24 * 60 // Total de minutos en un día del juego
		this.currentTime = 6 * 60 // Iniciar a las 6:00 AM (en minutos)
		this.timeMultiplier = 0.4 // Multiplicador de velocidad del tiempo
		// this.timeMultiplier = 10
	}

	getTime() {
		const totalMinutes = Math.floor(this.currentTime)
		const hours = Math.floor(totalMinutes / 60) % 24
		const minutes = totalMinutes % 60
		return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
			2,
			'0'
		)}`
	}

	update(deltaTime) {
		// Convertir deltaTime de milisegundos a segundos
		const elapsedRealSeconds = (deltaTime / 1000) * this.timeMultiplier
		const elapsedGameMinutes = elapsedRealSeconds * this.secondsPerRealSecond
		this.currentTime += elapsedGameMinutes
		this.currentHour = this.currentTime / 60

		// Reiniciar el ciclo si supera las 24 horas
		if (this.currentTime >= this.totalGameMinutes) {
			this.currentTime -= this.totalGameMinutes
			this.triggerDailyEvents()
		}
	}

	triggerDailyEvents() {
		console.log('Nuevo día en el juego!')
		// Ejemplo: Restablecer inventarios de tiendas
		// this.game.shops.forEach((shop) => shop.checkRestock(this.currentTime))
	}
}
