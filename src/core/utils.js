Array.prototype.parsed2D = function (cols) {
	const rows = []
	for (let i = 0; i < this.length; i += cols) {
		rows.push(this.slice(i, i + cols))
	}
	return rows
}

Array.prototype.createObjectsFrom2D = function (
	ObjectType,
	value,
	size = 16,
	custom
) {
	const objects = []

	this.forEach((row, y) => {
		row.forEach((symbol, x) => {
			if (symbol === value) {
				objects.push(
					new ObjectType({
						x: custom?.x ? x * size + custom.x : x * size,
						y: custom?.y ? y * size + custom.y : y * size,
						width: custom?.width ? custom.width : size,
						height: custom?.height ? custom.height : size,
					})
				)
			}
		})
	})
	return objects
}

export const fadeIn = (overlay, duration = 1000) => {
	return new Promise((resolve) => {
		const start = performance.now()
		const initialOpacity = overlay.opacity || 0
		const targetOpacity = 1

		const animate = (time) => {
			const elapsed = time - start
			const progress = Math.min(elapsed / duration, 1)
			overlay.opacity =
				initialOpacity + (targetOpacity - initialOpacity) * progress

			if (progress < 1) {
				requestAnimationFrame(animate)
			} else {
				resolve(true)
			}
		}

		requestAnimationFrame(animate)
	})
}

export const fadeOut = (overlay, duration = 1000) => {
	return new Promise((resolve) => {
		const start = performance.now()
		const initialOpacity = overlay.opacity || 1
		const targetOpacity = 0

		const animate = (time) => {
			const elapsed = time - start
			const progress = Math.min(elapsed / duration, 1)
			overlay.opacity =
				initialOpacity + (targetOpacity - initialOpacity) * progress

			if (progress < 1) {
				requestAnimationFrame(animate)
			} else {
				resolve(true)
			}
		}

		requestAnimationFrame(animate)
	})
}

export const waitFor = (time = 0, callback) => {
	setTimeout(() => {
		callback()
	}, time)
}
