export class Keyboard {
	constructor() {
		this.lastKey = {
			pressed: '',
			released: '',
		}
		this.pressed = false
		this.onPress = {
			left: false,
			right: false,
			up: false,
			down: false,

			w: false,
			a: false,
			d: false,
			s: false,

			space: false,
			q: false,
			e: false,
			r: false,

			escape: false,
			tab: false,
			shift: false,
		}
		this.keyDownEvent = null

		window.addEventListener('keydown', (e) => {
			const { key } = e
			// console.log(key)
			this.keyDownEvent = e
			switch (key) {
				case 'ArrowLeft':
					this.lastKey.pressed = 'PRESS left'
					this.pressed = true
					this.onPress.left = true
					break
				case 'ArrowRight':
					this.lastKey.pressed = 'PRESS right'
					this.pressed = true
					this.onPress.right = true
					break
				case 'ArrowUp':
					this.lastKey.pressed = 'PRESS up'
					this.pressed = true
					this.onPress.up = true
					break
				case 'ArrowDown':
					this.lastKey.pressed = 'PRESS down'
					this.pressed = true
					this.onPress.down = true
					break

				case 'w':
					this.lastKey.pressed = 'PRESS w'
					this.pressed = true
					this.onPress.w = true
					break
				case 'a':
					this.lastKey.pressed = 'PRESS a'
					this.pressed = true
					this.onPress.a = true
					break
				case 'd':
					this.lastKey.pressed = 'PRESS d'
					this.pressed = true
					this.onPress.d = true
					break
				case 's':
					this.lastKey.pressed = 'PRESS s'
					this.pressed = true
					this.onPress.s = true
					break

				case ' ':
					this.lastKey.pressed = 'PRESS space'
					this.pressed = true
					this.onPress.space = true
					break
				case 'q':
					this.lastKey.pressed = 'PRESS q'
					this.pressed = true
					this.onPress.q = true
					break
				case 'e':
					this.lastKey.pressed = 'PRESS e'
					this.pressed = true
					this.onPress.e = true
					break
				case 'r':
					this.lastKey.pressed = 'PRESS r'
					this.pressed = true
					this.onPress.r = true
					break

				case 'Escape':
					this.lastKey.pressed = 'PRESS Escape'
					this.pressed = true
					this.onPress.escape = true
					break
				case 'Tab':
					e.preventDefault()
					this.lastKey.pressed = 'PRESS Tab'
					this.pressed = true
					this.onPress.tab = true
					break
				case 'shift':
					e.preventDefault()
					this.lastKey.pressed = 'PRESS Shift'
					this.pressed = true
					this.onPress.shift = true
					break
			}
		})
		window.addEventListener('keyup', (e) => {
			const { key } = e
			this.keyDownEvent = null

			switch (key) {
				case 'ArrowLeft':
					this.lastKey.released = 'RELEASE left'
					this.pressed = false
					this.onPress.left = false
					break
				case 'ArrowRight':
					this.lastKey.released = 'RELEASE right'
					this.pressed = false
					this.onPress.right = false
					break
				case 'ArrowUp':
					this.lastKey.released = 'RELEASE up'
					this.pressed = false
					this.onPress.up = false
					break
				case 'ArrowDown':
					this.lastKey.released = 'RELEASE down'
					this.pressed = false
					this.onPress.down = false
					break

				case 'w':
					this.lastKey.released = 'RELEASE w'
					this.pressed = false
					this.onPress.w = false
					break
				case 'a':
					this.lastKey.released = 'RELEASE a'
					this.pressed = false
					this.onPress.a = false
					break
				case 'd':
					this.lastKey.released = 'RELEASE d'
					this.pressed = false
					this.onPress.d = false
					break
				case 's':
					this.lastKey.released = 'RELEASE s'
					this.pressed = false
					this.onPress.s = false
					break

				case ' ':
					this.lastKey.released = 'RELEASE space'
					this.pressed = false
					this.onPress.space = false
					break
				case 'q':
					this.lastKey.released = 'RELEASE q'
					this.pressed = false
					this.onPress.q = false
					break
				case 'e':
					this.lastKey.released = 'RELEASE e'
					this.pressed = false
					this.onPress.e = false
					break
				case 'r':
					this.lastKey.released = 'RELEASE r'
					this.pressed = false
					this.onPress.r = false
					break

				case 'Escape':
					this.lastKey.pressed = 'RELEASE Escape'
					this.pressed = false
					this.onPress.escape = false
					break
				case 'Tab':
					this.lastKey.pressed = 'RELEASE Tab'
					this.pressed = false
					this.onPress.tab = false
					break
				case 'Shift':
					this.lastKey.pressed = 'RELEASE Shift'
					this.pressed = false
					this.onPress.shift = false
					break
			}
		})
	}
}
