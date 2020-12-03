export default function addHover(map) {
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
      'fill-opacity': 0.85
    },
    'filter': ["==", "id", ""],
  }, 'labels-text');

  // Change the cursor to a pointer when the mouse is over the places layer.
  // Apply hover filter
  map.on('mousemove', 'places-fill', function (e) {
    map.getCanvas().style.cursor = 'pointer';
    map.setFilter('places-hover', ["==", "id", e.features[0].properties.id]);
  });

  // Change it back to a pointer when it leaves.
  map.on('mouseleave', 'places-fill', function () {
    map.getCanvas().style.cursor = '';
    map.setFilter('places-hover', ["==", "id", ""]);
  });
}
