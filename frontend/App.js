import React, { useEffect, useState } from 'react';

import {base, cursor, session} from '@airtable/blocks';
import {
    useLoadable,
    useRecords,
    useWatchable,
    Box,
    Button,
    RecordCardList,
    SelectButtons,
    Switch,
    Text
} from '@airtable/blocks/ui';

import MapBox from './MapBox';
import RecordErrorDialog from './RecordErrorDialog';

function App({activeTable, activeView, settings}) {
  useLoadable(cursor);

  // Permissions
  const canUpdate = session.checkPermissionsForUpdateRecords().hasPermission;

  // Switch options
  const appMode = [
    { value: false, label: 'View' },
    { value: true, label: 'Draw' }
  ];

  // Key for storing temporary preferences
  const sessionPrefsKey = `mapbox_prefs_${base.id}`;
  // Load session preferences
  const sessionPrefs = (
    sessionStorage.getItem(sessionPrefsKey) && JSON.parse(sessionStorage.getItem(sessionPrefsKey))
  ) || { // Defaults
    showBackground: false,
    showConditions: true
  };

  // States
  const [currentRecordIds, setCurrentRecordIds] = useState(cursor.selectedRecordIds);
  const [showBackground, setShowBackground] = useState(sessionPrefs.showBackground);
  const [showConditions, setShowConditions] = useState(sessionPrefs.showConditions);
  const [editMode, setEditMode] = useState(false);
  const [jsonErrorRecordIds, setJsonErrorRecordIds] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Watch
  useWatchable(cursor, 'selectedRecordIds', () => {
    setCurrentRecordIds(cursor.selectedRecordIds);
  });

  // Update session storage with user choices
  useEffect(() => {
    sessionStorage.setItem(sessionPrefsKey, JSON.stringify({
      showBackground,
      showConditions
    }));
  }, [showBackground, showConditions]);

  // Data
  const records = useRecords(activeView);

  const recordMap = new Map();
  records.forEach(record => recordMap.set(record.id, record));

  const selectedRecords = currentRecordIds.map(id => recordMap.get(id));

  const jsonErrorRecords = jsonErrorRecordIds.map(id => recordMap.get(id));

  return (
    <>
      <Box
        padding={2}
        display="flex"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="space-between"
        borderBottom="thick"
      >
        <Box
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          justifyContent="space-between"
        >
          {jsonErrorRecords.length === 0 ? '' : (
            <Button
              onClick={() => setIsDialogOpen(true)}
              size="small"
              icon="warning"
              variant="danger"
              marginRight={2}
              aria-label="GeoJSON Error"
            ></Button>
          )}
          {isDialogOpen && (
            <RecordErrorDialog records={jsonErrorRecords} closeDialog={() => setIsDialogOpen(false)} />
          )}
          {canUpdate && (
            <SelectButtons
              value={editMode}
              onChange={newValue => setEditMode(newValue)}
              options={appMode}
              size="small"
              width="160px"
              marginRight={2}
            />
          )}
          <Switch
            value={showBackground}
            onChange={newValue => setShowBackground(newValue)}
            label="Background"
            size="small"
            width="auto"
            marginRight={2}
          />
          <Switch
            value={showConditions}
            onChange={newValue => setShowConditions(newValue)}
            label="Conditions"
            size="small"
            width="auto"
          />
        </Box>
        {editMode ? (
          <Button
            onClick={() => console.log('Button clicked')}
            size="small"
            icon="upload"
          >
            Save
          </Button>
        ) : (
          <Button
            onClick={() => console.log('Button clicked')}
            size="small"
            icon="download"
          >
            PDF
          </Button>
        )}
      </Box>
      <Box position="relative" flexGrow={1}>
        <MapBox
          accessToken={settings.mapboxAccessToken}
          activeView={activeView}
          geoJsonColumn={settings.mapboxJsonTitle}
          records={records}
          selectRecord={(id) => setCurrentRecordIds([id])}
          selectedRecordIds={currentRecordIds}
          setJsonErrorRecords={(ids) => {
            if(jsonErrorRecordIds.join(',') !== ids.join(',')) setJsonErrorRecordIds(ids);
          }}
          showColors={showConditions}
        />
      </Box>
      <Box
        borderTop="thick"
        backgroundColor="lightGray1"
        height="100px"
        overflow="hidden"
      >
        {currentRecordIds.length === 0 ? (
        <Text
          display="flex"
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
          height="80px"
          margin="10px"
          backgroundColor="white"
          borderRadius="3px"
          boxShadow="rgba(0, 0, 0, 0.1) 0px 0px 0px 2px"
        >
          Select a record from Airtable or a shape on the map.
        </Text>
        ) : (
        <RecordCardList records={selectedRecords} />
        )}
      </Box>
    </>
  );
}

export default App;
