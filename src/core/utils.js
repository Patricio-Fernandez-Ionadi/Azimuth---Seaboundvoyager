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

// Collision
export const checkCollisions = (ob1, ob2) => {
	const box1 = ob1.hitbox ?? ob1
	const box2 = ob2.hitbox ?? ob2

	const isColliding =
		box1.x <= box2.x + box2.width &&
		box1.x + box1.width >= box2.x &&
		box1.y <= box2.y + box2.height &&
		box1.y + box1.height >= box2.y

	if (!isColliding) return null

	const xOverlap = Math.min(
		box1.x + box1.width - box2.x,
		box2.x + box2.width - box1.x
	)
	const yOverlap = Math.min(
		box1.y + box1.height - box2.y,
		box2.y + box2.height - box1.y
	)

	if (xOverlap < yOverlap) {
		return box1.x < box2.x ? 'right' : 'left'
	} else {
		return box1.y < box2.y ? 'bottom' : 'top'
	}
}

/* ASYNC */

// animation
export const fadeOut = (overlay, duration = 1000) => {
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
export const fadeIn = (overlay, duration = 1000) => {
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

// delayer
export const waitFor = (time = 0, callback) => {
	setTimeout(() => {
		callback()
	}, time)
}

// image
export const loadImage = (src) => {
	return new Promise((resolve, reject) => {
		const img = new Image()
		img.onload = () => resolve(img)
		img.onerror = reject
		img.src = src
	})
}
