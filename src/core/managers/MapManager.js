export class MapManager {
	constructor(game) {
		this.game = game
		this.zones = []
	}

	async loadMap(jsonPath) {
		const response = await fetch(jsonPath)
		const mapData = await response.json()

		// console.log(mapData)

		const zoneLayer = mapData.layers.find((layer) => layer.name === 'zones')
		zoneLayer.objects.forEach((zone) => {
			this.zones.push({
				x: zone.x,
				y: zone.y,
				width: zone.width,
				height: zone.height,
				properties: zone.properties,
				name: zone.name,
			})
		})
	}

	parseProperties(properties) {
		const result = {}
		properties.forEach((prop) => {
			result[prop.name] = prop.value
		})
		return result
	}

	getZoneAt(x, y) {
		// let zone = null
		return this.zones.find((zone, index) => {
			if (
				x >= zone.x &&
				x <= zone.x + zone.width &&
				y >= zone.y &&
				y <= zone.y + zone.height
			) {
				return this.zones[index]
			}
		})
	}
}
