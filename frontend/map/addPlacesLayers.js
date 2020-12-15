/**
 * Add fill and outline layers for the "places" source
 *
 * @param map mapboxgl.Map
 */
const placesFill_FillOpacity = [
  'case',
  ['get', 'selected'],
  0.75, // Selected
  0.3 // Default
];

export function addPlacesLayers(map) {
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
      'fill-opacity': placesFill_FillOpacity,
    },
    'filter': ['==', 'invisible', false],
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
      'line-width': 2,
    },
    'filter': ['==', 'invisible', false],
  });
}

export function setPlacesFillOpacity(map, normal) {
  map.setPaintProperty('places-fill', 'fill-opacity', normal ? placesFill_FillOpacity : 0);
}
