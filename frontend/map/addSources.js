/**
 * Add empty sources to the map.
 * The necessary data is usually not available by first render.
 * @param map mapboxgl.Map
 */
export default function addSources(map) {
  map.addSource('places', {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection',
      'features': []
    },
  });

  map.addSource('labels', {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection',
      'features': []
    },
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 25, // Radius of each cluster when clustering points (defaults to 50)
  });
}
