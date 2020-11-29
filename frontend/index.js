import React, {useState} from 'react';

import {
    initializeBlock,
    useSettingsButton,
} from '@airtable/blocks/ui';

import AppWrapper from './AppWrapper';
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
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh'
          }}>
            <AppWrapper settings={settings}/>
          </div>
        )}
      </>
  );
}

initializeBlock(() => <MapboxViewer /> );
