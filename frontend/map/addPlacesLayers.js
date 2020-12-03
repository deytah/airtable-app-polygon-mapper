/**
 * Add fill and outline layers for the "places" source
 *
 * @param map mapboxgl.Map
 */
export default function addPlacesLayers(map) {
  map.addLayer({
    'id': 'places-fill',
    'type': 'fill',
    'source': 'places',
    'layout': {},
    'paint': {
      'fill-color': [
        'case',
        ['has', 'color'],
        ['get', 'color'],
        '#627BC1'
      ],
      'fill-opacity': [
        'case',
        ['get', 'selected'],
        0.75, // Selected
        0.3 // Default
      ]
    },
  });

  map.addLayer({
    'id': 'places-outline',
    'type': 'line',
    'source': 'places',
    'layout': {},
    'paint': {
      'line-color': [
        'case',
        ['has', 'color'],
        ['get', 'color'],
        '#627BC1'
      ],
      'line-width': 2
    },
  });

}
