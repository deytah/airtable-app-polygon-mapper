import React, {useState} from 'react';

import {session} from "@airtable/blocks";
import {
    initializeBlock,
    useSettingsButton,
} from '@airtable/blocks/ui';

import AppWrapper from './components/AppWrapper';
import {useSettings} from './hooks/settings';
import SettingsForm from './components/SettingsForm';

function AddSettingsButton({toggleOpen}) {
  useSettingsButton(() => toggleOpen());
  return '';
}

function MapboxViewer() {
  const canUpdate = session.checkPermissionsForUpdateRecords().hasPermission;

  // Settings
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {isValid, settings} = useSettings();

  if (!isSettingsOpen && !isValid) {
    setIsSettingsOpen(true)
  }

  // Load the block
  return (
      <>
        <link href="https://api.mapbox.com/mapbox-gl-js/v2.0.0/mapbox-gl.css" rel="stylesheet" />
        <link
          rel="stylesheet"
          href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.2.0/mapbox-gl-draw.css"
          type="text/css"
        />
        {canUpdate && (
          <AddSettingsButton toggleOpen={() => setIsSettingsOpen(!isSettingsOpen)}/>
        )}
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
