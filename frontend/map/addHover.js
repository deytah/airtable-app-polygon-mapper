const filter = [
  'all',
  ['==', 'invisible', false],
  ["==", "id", ""]
];

const fillOpacity = 0.85;

export function addHover(map) {
  // Hover Layer
  map.addLayer({
    'id': 'places-hover',
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
      'fill-opacity': fillOpacity,
    },
    'filter': [
      'all',
      ['==', 'invisible', false],
      ["==", "id", ""]
    ],
  }, 'labels-text');

  // Change the cursor to a pointer when the mouse is over the places layer.
  // Apply hover filter
  map.on('mousemove', 'places-fill', function (e) {
    if (!e.features[0].properties.invisible) {
      map.getCanvas().style.cursor = 'pointer';
    }
    filter[2][2] = e.features[0].properties.id;
    map.setFilter('places-hover', filter);
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'places-fill', function () {
    map.getCanvas().style.cursor = '';
    filter[2][2] = '';
    map.setFilter('places-hover', filter);
  });
}

export function setHoverFillOpacity(map, normal) {
  map.setPaintProperty('places-hover', 'fill-opacity', normal ? fillOpacity : 0);
}
