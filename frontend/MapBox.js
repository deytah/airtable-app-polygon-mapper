import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  Text
} from '@airtable/blocks/ui';
import mapboxgl from 'mapbox-gl';

const MapBox = ( {accessToken, activeView, geoJsonColumn, records, selectRecord} ) => {

  mapboxgl.accessToken = accessToken;

  const mapContainerRef = useRef(null);

  const [lng, setLng] = useState(-100);
  const [lat, setLat] = useState(38);
  const [zoom, setZoom] = useState(1);

  const features = records.filter(record => record.getCellValue(geoJsonColumn)).map(record => {
    const source = {
      type: 'Feature',
      geometry: JSON.parse(record.getCellValue(geoJsonColumn)),
      properties: {
        id: record.id,
        name: record.name
      }
    };

    try {
      const color = record.getColorHexInView(activeView);
      if (color) {
        source.properties.color = color;
      }
    } catch(e) {}

    return source;
  });

  // Initialize map when component mounts
  useEffect(() => {
    console.log('Hello, map!');

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: zoom
    });

    // Map controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.on('move', () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    // Draw polygons
    map.on('load', function () {
      map.addSource('places', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': features
        },
      });

      // Add a layer showing the places.
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
          'fill-opacity': 0.5
        }
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
        }
      });

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
          'fill-opacity': 0.75
        },
        'filter': ["==", "id", ""]
      });

      // When a click event occurs on a feature in the places layer, open a popup at the
      // location of the click, with description HTML from its properties.
      map.on('click', 'places-fill', function (e) {
        selectRecord(e.features[0].properties.id);

        // Popup Tooltip
        // new mapboxgl.Popup()
        // .setLngLat(e.lngLat)
        // .setHTML(e.features[0].properties.name)
        // .addTo(map);
      });

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

    });

    // Clean up on unmount
    return () => map.remove();
  }, []);

  return (
    <>
      <Box
        display='none'
        position='absolute'
        top={0}
        left={0}
        zIndex='5'
        margin={2}
        padding={2}
        backgroundColor='grayDark1'
      >
        <Text textColor='white'>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </Text>
      </Box>
      <div className='map-container' ref={mapContainerRef}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          borderBottom: '1px solid #ddd',
        }} />
    </>
  );
};

export default MapBox;
