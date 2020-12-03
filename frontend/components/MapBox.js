import React, {useEffect, useRef, useState} from 'react';
import {Box, Text} from '@airtable/blocks/ui';

import * as geojsonBounds from 'geojson-bounds';
import mapboxgl from 'mapbox-gl';

import findPoint from '../lib/findPoint';
import debounce from '../lib/debounce';

import addClustering from '../map/addClustering';
import addHover from "../map/addHover";
import addPlacesLayers from "../map/addPlacesLayers";
import addSources from "../map/addSources";
import zoomSelected from '../map/zoomSelected';

const MapBox = ({
                  accessToken,
                  activeView,
                  geoJsonColumn,
                  map,
                  records,
                  selectedRecordIds,
                  selectRecord,
                  setJsonErrorRecords,
                  setMap,
                  showColors
                }) => {

  mapboxgl.accessToken = accessToken;

  const mapContainerRef = useRef(null);

  const [features, setFeatures] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [lng, setLng] = useState(-100);
  const [lat, setLat] = useState(38);
  const [zoom, setZoom] = useState(1);

  function parseFeatures() {
    const jsonErrorRecords = [];
    const newFeatures = records.filter(record => record.getCellValue(geoJsonColumn)).map(record => {
      try {
        const source = {
          type: 'Feature',
          geometry: JSON.parse(record.getCellValueAsString(geoJsonColumn)),
          id: record.id,
          properties: {
            id: record.id,
            name: record.name,
            selected: selectedRecordIds.includes(record.id)
          }
        };

        source.properties.labelPoint = findPoint(source);

        if (showColors) {
          try {
            const color = record.getColorHexInView(activeView);
            if (color) {
              source.properties.color = color;
            }
          } catch (e) {
            null
          }
        }
        return source;

      } catch (e) {
        jsonErrorRecords.push(record.id);
        return null;
      }
    }).filter(r => r !== null);
    if (JSON.stringify(newFeatures) !== JSON.stringify(features)) {
      setFeatures(newFeatures);
    }
    setJsonErrorRecords(jsonErrorRecords);
  }

  const labels = features.map(feature => {
    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: feature.properties.labelPoint
      },
      properties: {
        id: feature.properties.id,
        name: feature.properties.name,
        original: feature,
        selected: feature.properties.selected,
      }
    };
  });

  useEffect(() => {
    if (initialized) {
      zoomSelected(map, selectedRecordIds, features);
    }
  }, [selectedRecordIds]);

  useEffect(() => {
    if (initialized) {
      setInitialized(false);
    }
  }, [activeView]);

  useEffect(() => {
    parseFeatures();
  }, [records]);

  // Initialize map when component mounts
  useEffect(() => {

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
      addSources(map);

      addPlacesLayers(map);

      map.addLayer({
        'id': 'labels-text',
        'type': 'symbol',
        'source': 'labels',
        'layout': {
          'text-field': ['get', 'name'],
          'text-variable-anchor': ['center'],
          'text-justify': 'auto',
        },
        'filter': ['!', ['has', 'point_count']],
      });

      addClustering(map);

      // Adds additional fill layer and events
      addHover(map);

      // When a click event occurs on a feature in the places layer, open a popup at the
      // location of the click, with description HTML from its properties.
      map.on('click', 'places-fill', function (e) {
        selectRecord(e.features[0].properties.id);

        map.fitBounds(geojsonBounds.extent(e.features[0]), {
          padding: 20,
        });

        // Popup Tooltip
        // new mapboxgl.Popup()
        // .setLngLat(e.lngLat)
        // .setHTML(e.features[0].properties.name)
        // .addTo(map);
      });

      const labelsDebounce = debounce(() => updateMapPolygons(map), 500);
      map.on('sourcedata', (e) => {
        if (e.sourceId === 'labels') {
          labelsDebounce();
        }
      });
      map.on('zoomend', labelsDebounce);
      map.on('moveend', labelsDebounce);

      // Add Map to state
      setMap(map);

      // Update FeatureCollection data
      updateMap();
    });

    // Clean up on unmount
    return () => {
      map.remove();
      setMap(null);
    }
  }, []);

  function updateMapPolygons(map) {
    const features = map.querySourceFeatures('labels', {sourceLayer: 'labels-text'})
      .filter(feature => !feature.id)
      .map(f => JSON.parse(f.properties.original));
    map.getSource('places').setData({
      type: 'FeatureCollection',
      features
    });
  }

  // Update FeatureCollection data
  function updateMap() {
    if (map) {
      const labelsSource = map.getSource('labels');
      labelsSource.setData({
        type: 'FeatureCollection',
        features: labels
      });

      if (!initialized) {
        zoomSelected(map, selectedRecordIds, features);
        setInitialized(true);
      }
    }
  }

  // Observe features for record changes
  useEffect(() => {
    updateMap();
  }, [features, map])

  return (
    <>
      <Box
        display="none"
        position="absolute"
        top={0}
        left={0}
        zIndex="5"
        margin={2}
        padding={2}
        backgroundColor="grayDark1">
        <Text textColor="white">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </Text>
      </Box>
      <div
        className="map-container"
        ref={mapContainerRef}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        }}/>
    </>
  );
};

export default MapBox;
