import React, {useEffect, useState} from 'react';

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
  Text,
  Tooltip
} from '@airtable/blocks/ui';

// Components
import {MapBox} from './MapBox';
import {ChangesConfirmationDialog} from "./ChangesConfirmationDialog";
import RecordErrorDialog from './RecordErrorDialog';
import SaveMapDialog from './SaveMapDialog';

// Lib functions
import {polygonEditor} from "../lib/polygonEditor";

// Switch options
const appMode = [
  {value: false, label: 'View'},
  {value: true, label: 'Draw'}
];

function App({activeTable, activeView, settings}) {
  useLoadable(cursor);

  // Permissions
  const canUpdate = session.checkPermissionsForUpdateRecords().hasPermission;

  // Key for storing temporary preferences
  const sessionPrefsKey = `mapbox_prefs_${base.id}`;
  // Load session preferences
  const sessionPrefs = (
    sessionStorage.getItem(sessionPrefsKey) && JSON.parse(sessionStorage.getItem(sessionPrefsKey))
  ) || { // Defaults
    showBackgrounds: false,
    showConditions: true
  };

  // States
  const [currentRecordIds, setCurrentRecordIds] = useState([]);
  const [potentialSelection, setPotentialSelection] = useState([]);
  const [showBackgrounds, setShowBackgrounds] = useState(sessionPrefs.showBackgrounds);
  const [showConditions, setShowConditions] = useState(sessionPrefs.showConditions);
  const [editMode, setEditMode] = useState(false);
  const [jsonErrorRecordIds, setJsonErrorRecordIds] = useState([]);
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isChangesConfirmationDialogOpen, setIsChangesConfirmationDialogOpen] = useState(false);
  const [map, setMap] = useState(null);

  // Watch
  useWatchable(cursor, 'selectedRecordIds', () => {
    setPotentialSelection(cursor.selectedRecordIds);
  });

  // Update session storage with user choices
  useEffect(() => {
    sessionStorage.setItem(sessionPrefsKey, JSON.stringify({
      showBackgrounds,
      showConditions
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showBackgrounds, showConditions]);

  // Data
  const records = useRecords(activeView);

  const recordMap = new Map();
  records.forEach(record => recordMap.set(record.id, record));

  const selectedRecords = currentRecordIds
    .filter(id => recordMap.has(id))
    .map(id => recordMap.get(id));

  const jsonErrorRecords = jsonErrorRecordIds.map(id => recordMap.get(id));

  function updateSelectedRecordsIds() {
    setIsChangesConfirmationDialogOpen(false);
    if (editMode) polygonEditor.reset(map);
    setCurrentRecordIds(potentialSelection);
  }

  useEffect(() => {
    if (JSON.stringify(currentRecordIds) !== JSON.stringify(potentialSelection)) {
      if (editMode && polygonEditor.isDirty()) {
        setIsChangesConfirmationDialogOpen(true);
      } else {
        updateSelectedRecordsIds();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [potentialSelection]);

  function onSave() {
    if (map) {
      const values = {};
      const geometry = polygonEditor.get();
      values[settings.geometryField] = geometry ? JSON.stringify(geometry) : geometry;
      polygonEditor.saved();
      activeTable.updateRecordAsync(selectedRecords[0].id, values).then();
    }
  }

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
              onClick={() => setIsErrorDialogOpen(true)}
              size="small"
              icon="warning"
              variant="danger"
              marginRight={2}
              aria-label="GeoJSON Error"
            />
          )}
          {canUpdate && (
            <SelectButtons
              value={editMode}
              onChange={newValue => setEditMode(!!newValue)}
              options={appMode}
              size="small"
              width="160px"
              marginRight={2}
            />
          )}
          {settings.images.table && (
            <Tooltip
              content="Toggle image overlays"
              placementX={Tooltip.placements.CENTER}
              placementY={Tooltip.placements.BOTTOM}
              shouldHideTooltipOnClick={true}
            >
              <Switch
                value={showBackgrounds}
                onChange={newValue => setShowBackgrounds(newValue)}
                label="Background"
                size="small"
                width="auto"
                marginRight={2}
              />
            </Tooltip>
          )}
          <Tooltip
            content="Toggle colors set by Conditions"
            placementX={Tooltip.placements.CENTER}
            placementY={Tooltip.placements.BOTTOM}
            shouldHideTooltipOnClick={true}
          >
            <Switch
              value={showConditions}
              onChange={newValue => setShowConditions(newValue)}
              label="Conditions"
              size="small"
              width="auto"
            />
          </Tooltip>
        </Box>
        {editMode ? (
          <Button
            onClick={() => onSave()}
            size="small"
            icon="plusFilled"
            variant="primary"
          >
            Save
          </Button>
        ) : (
          <Button
            onClick={() => setIsSaveDialogOpen(true)}
            size="small"
            icon="download"
            variant="primary"
          >
            PDF
          </Button>
        )}
      </Box>
      <Box position="relative" flexGrow={1}>
        <MapBox
          activeTable={activeTable}
          activeView={activeView}
          editMode={editMode}
          map={map}
          records={records}
          selectRecord={(id) => setPotentialSelection([id])}
          selectedRecordIds={currentRecordIds}
          setJsonErrorRecords={(ids) => {
            if (jsonErrorRecordIds.join(',') !== ids.join(',')) setJsonErrorRecordIds(ids);
          }}
          setMap={setMap}
          showBackgrounds={showBackgrounds}
          showColors={showConditions}
        />
      </Box>
      <Box
        borderTop="thick"
        backgroundColor="lightGray1"
        height="100px"
        overflow="hidden"
      >
        {selectedRecords.length === 0 ? (
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
          <RecordCardList records={selectedRecords} view={activeView}/>
        )}
      </Box>
      {isErrorDialogOpen && (
        <RecordErrorDialog records={jsonErrorRecords} closeDialog={() => setIsErrorDialogOpen(false)}/>
      )}
      {isSaveDialogOpen && (
        <SaveMapDialog closeDialog={() => setIsSaveDialogOpen(false)} map={map}/>
      )}
      {isChangesConfirmationDialogOpen && (
        <ChangesConfirmationDialog
          onCancel={() => setIsChangesConfirmationDialogOpen(false)}
          onConfirm={() => updateSelectedRecordsIds()}/>
      )}
    </>
  );
}

export default App;
