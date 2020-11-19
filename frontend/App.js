import React, { useRef, useEffect, useState } from 'react';

import {cursor} from '@airtable/blocks';
import {recordColoring} from '@airtable/blocks/models';
import {
    useBase,
    useLoadable,
    useRecordById,
    useRecords,
    useSettingsButton,
    useWatchable,
    Box,
    Button,
    RecordCardList,
    Switch
} from '@airtable/blocks/ui';

import MapBox from './MapBox';

function App({settings}) {
  useLoadable(cursor);

  const [currentRecordIds, setCurrentRecordIds] = useState(cursor.selectedRecordIds);
  const [isEnabled, setIsEnabled] = useState(true);

  useWatchable(cursor, ['activeTableId', 'activeViewId']);
  useWatchable(cursor, 'selectedRecordIds', () => {
    setCurrentRecordIds(cursor.selectedRecordIds);
  });

  const base = useBase();
  const activeTable = base.getTableByIdIfExists(cursor.activeTableId);
  const activeView = activeTable.getViewByIdIfExists(cursor.activeViewId);

  const records = useRecords(activeView, {
    recordColorMode: recordColoring.modes.byView(activeView)
  });

  const recordMap = new Map();
  records.forEach(record => recordMap.set(record.id, record));

  const selectedRecords = currentRecordIds.map(id => recordMap.get(id));

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh'
    }}>
      <Box padding={2} display="flex" alignItems="center" justifyContent="space-between">
        <Switch
          value={isEnabled}
          onChange={newValue => setIsEnabled(newValue)}
          label="Show Conditions"
          size="small"
          width="auto"
        />
        <Button
          onClick={() => console.log("Button clicked")}
          size="small"
          icon="download"
        >
          PDF
        </Button>
      </Box>
      <div style={{
        position: 'relative',
        flexGrow: 1
      }}>
        <MapBox
          accessToken={settings.mapboxAccessToken}
          activeView={activeView}
          geoJsonColumn={settings.mapboxJsonTitle}
          records={records}
          selectRecord={(id) => setCurrentRecordIds([id])}
        />
      </div>
      <Box height='100px'>
        <RecordCardList records={selectedRecords} />
      </Box>
    </div>
  );
}

export default App;
