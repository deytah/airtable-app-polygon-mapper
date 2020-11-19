import React, {Fragment, useState, useCallback, useEffect} from 'react';

import {cursor} from '@airtable/blocks';
import {ViewType} from '@airtable/blocks/models';
import {
    initializeBlock,
    registerRecordActionDataCallback,
    useBase,
    useRecordById,
    useLoadable,
    useSettingsButton,
    useWatchable,
    Box,
    Dialog,
    Heading,
    Link,
    Text,
    TextButton,
} from '@airtable/blocks/ui';

import App from './App';
import {useSettings} from './settings';
import SettingsForm from './SettingsForm';

function MapboxViewer() {

  // Settings
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  useSettingsButton(() => setIsSettingsOpen(!isSettingsOpen));

  const {isValid, settings} = useSettings();

  if (!isSettingsOpen && !isValid) {
    setIsSettingsOpen(true)
  }

  // Load the block
  return (
      <>
        <link href="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css" rel="stylesheet" />
        {isSettingsOpen || !isValid ? (
            <SettingsForm setIsSettingsOpen={setIsSettingsOpen} />
        ) : (
          <App settings={settings}/>
        )}
      </>
  );
}

initializeBlock(() => <MapboxViewer /> );
