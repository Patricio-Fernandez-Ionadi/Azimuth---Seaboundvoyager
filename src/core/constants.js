/**
 * SCENES
 * ----------------------------------------------------------------------
 * Registro central de las escenas del juego. Cada ciudad declara
 * únicamente su `name` y su clave de escena (`scene`).
 *
 * Los NPCs de cada ciudad viven en su propio archivo `npcs.js` dentro
 * de la carpeta correspondiente (`scenes/cities/<dir>/npcs.js`) y se
 * cargan vía CityScene con la factory createNPC.
 *
 * Las claves de `scene` se usan en Game.js para registrar las escenas
 * en el SceneManager y para navegar entre ellas.
 */
export const SCENES = {
	city: {
		valeris: { name: 'Puerto Valeris', scene: 'puerto_valeris_scene' },
		bahiadeloslamentos: { name: 'Bahía de los Lamentos', scene: 'bahia_de_los_lamentos_scene' },
		ciudadluzmar: { name: 'Ciudad Luzmar', scene: 'ciudad_luzmar_scene' },
		fuertedragal: { name: 'Fuerte Dragal', scene: 'fuerte_dragal_scene' },
		marjaloscuro: { name: 'Marjal Oscuro', scene: 'marjal_oscuro_scene' },
		bastiondemedianoche: { name: 'Bastión de Medianoche', scene: 'bastion_de_medianoche_scene' },
		puertosombrio: { name: 'Puerto Sombrío', scene: 'puerto_sombrio_scene' },
		ciudadaurea: { name: 'Ciudad Áurea', scene: 'ciudad_aurea_scene' },
		puertodelasmareas: { name: 'Puerto de las Mareas', scene: 'puerto_de_las_mareas_scene' },
		rocadeltrueno: { name: 'Roca del Trueno', scene: 'roca_del_trueno_scene' },
		arrecifecarmesi: { name: 'Arrecife Carmesí', scene: 'arrecife_carmesi_scene' },
		fuertesanguinario: { name: 'Fuerte Sanguinario', scene: 'fuerte_sanguinario_scene' },
		puertomistral: { name: 'Puerto Mistral', scene: 'puerto_mistral_scene' },
		islabrumaris: { name: 'Isla Brumaris', scene: 'isla_brumaris_scene' },
		puertoespejomar: { name: 'Puerto Espejomar', scene: 'puerto_espejomar_scene' },
		isladelosnaufragios: { name: 'Isla de los Naufragios', scene: 'isla_de_los_naufragios_scene' },
		refugiocorsario: { name: 'Refugio Corsario', scene: 'refugio_corsario_scene' },
		caladelexilio: { name: 'Cala del Exilio', scene: 'cala_del_exilio_scene' },
		isladelabismo: { name: 'Isla del Abismo', scene: 'isla_del_abismo_scene' },
		isladelossusurros: { name: 'Isla de los Susurros', scene: 'isla_de_los_susurros_scene' },
		caletaespectral: { name: 'Caleta Espectral', scene: 'caleta_espectral_scene' },
		ciudadmercaris: { name: 'Ciudad Mercaris', scene: 'ciudad_mercaris_scene' },
		villatempestad: { name: 'Villa Tempestad', scene: 'villa_tempestad_scene' },
	},
	menu: 'menu_scene',
	creation: 'creation_scene',
	map: 'world_map_scene',
}

/** Mapea nombre legible -> clave de escena para la world map. */
export const CITY_ZONE_MAP = {
	'Puerto Veleris': SCENES.city.valeris,
	'Bahía de los Lamentos': SCENES.city.bahiadeloslamentos,
	'Ciudad Luzmar': SCENES.city.ciudadluzmar,
	'Fuerte Dragal': SCENES.city.fuertedragal,
	'Marjal Oscuro': SCENES.city.marjaloscuro,
	'Bastión de Medianoche': SCENES.city.bastiondemedianoche,
	'Puerto Sombrío': SCENES.city.puertosombrio,
	'Ciudad Áurea': SCENES.city.ciudadaurea,
	'Puerto de las Mareas': SCENES.city.puertodelasmareas,
	'Roca del Trueno': SCENES.city.rocadeltrueno,
	'Arrecife Carmesí': SCENES.city.arrecifecarmesi,
	'Fuerte Sanguinario': SCENES.city.fuertesanguinario,
	'Puerto Mistral': SCENES.city.puertomistral,
	'Isla Brumaris': SCENES.city.islabrumaris,
	'Puerto Espejomar': SCENES.city.puertoespejomar,
	'Isla de los Naufragios': SCENES.city.isladelosnaufragios,
	'Refugio Corsario': SCENES.city.refugiocorsario,
	'Cala del Exilio': SCENES.city.caladelexilio,
	'Isla del Abismo': SCENES.city.isladelabismo,
	'Isla de los Susurros': SCENES.city.isladelossusurros,
	'Caleta Espectral': SCENES.city.caletaespectral,
	'Ciudad Mercaris': SCENES.city.ciudadmercaris,
	'Villa Tempestad': SCENES.city.villatempestad,
}
