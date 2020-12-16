/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useRef, useState} from 'react';
import {Box, Text, useBase, useRecords} from '@airtable/blocks/ui';

import mapboxgl from 'mapbox-gl';

import findPoint from '../lib/findPoint';
import debounce from '../lib/debounce';
import {polygonEditor} from "../lib/polygonEditor";

import addClustering from '../map/addClustering';
import {addHover, setHoverFillOpacity} from "../map/addHover";
import {addPlacesLayers, setPlacesFillOpacity} from "../map/addPlacesLayers";
import addSources from "../map/addSources";
import zoomSelected from '../map/zoomSelected';
import {useSettings} from "../hooks/settings";
import {removeImageSources, setImageRasterOpacity, updateImageSources} from "../map/addImagesSources";

export function MapBox({
                         // properties
                         activeTable,
                         activeView,
                         editMode,
                         map,
                         records,
                         selectedRecordIds,
                         showBackgrounds,
                         showColors,

                         // functions
                         selectRecord,
                         setJsonErrorRecords,
                         setMap,
                       }) {

  const mapContainerRef = useRef(null);

  const [features, setFeatures] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [lng, setLng] = useState(-100);
  const [lat, setLat] = useState(38);
  const [zoom, setZoom] = useState(1);

  const {settings} = useSettings();
  const geometryField = settings.geometryField;
  const labelField = settings.labelField && activeTable.getFieldByNameIfExists(settings.labelField)
    ? settings.labelField : activeTable.primaryField;
  mapboxgl.accessToken = settings.mapboxAccessToken;

  function parseFeatures() {
    const jsonErrorRecords = [];
    const selectedIds = selectedRecordIds.length === 1 && editMode ? selectedRecordIds : [];
    const newFeatures = records.filter(record => record.getCellValue(geometryField)).map(record => {
      try {
        const source = {
          type: 'Feature',
          geometry: JSON.parse(record.getCellValueAsString(geometryField) || null),
          id: record.id,
          properties: {
            id: record.id,
            name: record.getCellValueAsString(labelField),
            selected: selectedRecordIds.includes(record.id),
            invisible: selectedIds.includes(record.id),
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
            // Silently fail to use default layer color
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
      zoomSelected(map, selectedRecordIds, features, editMode);

      if (selectedRecordIds.length === 1 && editMode) {
        try {
          polygonEditor.toggle(map, true);
          const record = records.find(r => r.id === selectedRecordIds[0]);
          const feature = {
            id: Date.now(),
            type: 'Feature',
            properties: {},
            geometry: JSON.parse(record.getCellValueAsString(geometryField) || null)
          };
          if (feature.geometry) {
            polygonEditor.add(feature);
          }
        } catch (e) {
          // Most likely bad JSON
          polygonEditor.toggle(map, false);
        }
      } else {
        polygonEditor.toggle(map, false);
      }
    }
  }, [editMode, selectedRecordIds]);

  useEffect(() => {
    if (initialized) {
      setInitialized(false);
    }
  }, [activeView]);

  useEffect(() => {
    parseFeatures();
  }, [editMode, records, selectedRecordIds]);

  useEffect(() => {
    if (map && activeTable) {
      setPlacesFillOpacity(map, activeTable.id !== settings.images.table);
      setHoverFillOpacity(map, activeTable.id !== settings.images.table);
      setImageRasterOpacity(map, activeTable.id !== settings.images.table);
    }
  }, [activeTable, map, settings.images.table])

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
      setLng(+(map.getCenter().lng.toFixed(4)));
      setLat(+(map.getCenter().lat.toFixed(4)));
      setZoom(+(map.getZoom().toFixed(2)));
    });

    polygonEditor.init(map);

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
          'text-allow-overlap': true,
          'text-size': 14,
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

        // Popup Tooltip
        // new mapboxgl.Popup()
        // .setLngLat(e.lngLat)
        // .setHTML(e.features[0].properties.name)
        // .addTo(map);
      });

      map.on('click', function (e) {
        const features = map.queryRenderedFeatures(e.point, {layers: ['places-fill']});
        const isActive = polygonEditor.isActive(map);
        if (!isActive && features.length === 0) {
          selectRecord();
        }
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
    };
  }, []);

  function updateMapPolygons(map) {
    try {
      const features = map.querySourceFeatures('labels', {sourceLayer: 'labels-text'})
        .filter(feature => !feature.id)
        .map(f => JSON.parse(f.properties.original));
      map.getSource('places').setData({
        type: 'FeatureCollection',
        features
      });
    } catch (e) {
      // Catch the odd disappearing map
    }
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
        zoomSelected(map, selectedRecordIds, features, editMode);
        setInitialized(true);
      }
    }
  }

  // Observe features for record changes
  useEffect(() => {
    updateMap();
  }, [features, map]);

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
      {settings.images.table && initialized && (
        <ImageSourceRecords activeTable={activeTable} map={map} settings={settings.images} show={showBackgrounds}/>
      )}
    </>
  );
};

function ImageSourceRecords({activeTable, map, settings, show}) {
  const [sourceRecords, setSourceRecords] = useState([]);
  const base = useBase();
  const table = base.getTableById(settings.table);
  const records = useRecords(table);

  useEffect(() => {
    if (
      JSON.stringify(sourceRecords.map(r => r.toString())) !==
      JSON.stringify(records.map(r => r.toString()))
    ) {
      setSourceRecords(records);
    }
  }, [records]);

  useEffect(() => {
    if (show) {
      updateImageSources(map, records, settings);
      if (activeTable) {
        setImageRasterOpacity(map, activeTable.id !== settings.table);
      }
    } else {
      removeImageSources(map);
    }
  }, [show, sourceRecords]);

  return (<></>);
}
