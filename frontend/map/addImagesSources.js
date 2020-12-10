const sources = [];

/**
 * Add image sources to the map.
 * @param map mapboxgl.Map
 * @param records Record[]
 * @param settings
 */
export function addImageSources(map, records, settings) {
  sources.splice(0);
  records.forEach(record => {
    try {
      const coordinates = JSON.parse(record.getCellValueAsString(settings.geometryField))
        .coordinates[0]
        .slice(0, 4);

      const image = record.getCellValue(settings.imageField);

      if (!image) return;

      map.addSource(record.id, {
        type: 'image',
        url: image[0].url,
        coordinates,
      });
      map.addLayer({
        id: record.id,
        source: record.id,
        type: 'raster',
        paint: { 'raster-opacity': 0.85 }
      }, 'places-fill');

      sources.push(record.id);
    } catch (e) {
      // Ignore bad JSON
    }
  });
}

export function removeImageSources(map) {
  sources.forEach(id => {
    if (map?.getSource(id)) {
      map?.removeLayer(id);
      map?.removeSource(id);
    }
  });
}

export function updateImageSources(map, records, settings) {
  removeImageSources(map);
  addImageSources(map, records, settings);
}
