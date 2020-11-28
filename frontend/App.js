import React, { useRef, useEffect, useState } from 'react';

import {cursor} from '@airtable/blocks';
import {recordColoring} from '@airtable/blocks/models';
import {
    useBase,
    useLoadable,
    useRecordById,
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

function App({activeTable, activeView, settings}) {
  useLoadable(cursor);

  // States
  const [currentRecordIds, setCurrentRecordIds] = useState(cursor.selectedRecordIds);
  const [showBackground, setShowBackground] = useState(false);
  const [showConditions, setShowConditions] = useState(true);
  const appMode = [
    { value: 'view', label: 'View' },
    { value: 'draw', label: 'Draw' }
  ]
  const [value, setValue] = useState(appMode[0].value);
  const [jsonErrorRecords, setJsonErrorRecords] = useState([]);

  // Watch
  useWatchable(cursor, 'selectedRecordIds', () => {
    setCurrentRecordIds(cursor.selectedRecordIds);
  });

  // Data
  const records = useRecords(activeView, {
    recordColorMode: recordColoring.modes.byView(activeView)
  });

  const recordMap = new Map();
  records.forEach(record => recordMap.set(record.id, record));

  const selectedRecords = currentRecordIds.map(id => recordMap.get(id));

  return (
    <>
      <Box padding={2} display='flex' flexWrap='wrap' alignItems='center' justifyContent='space-between'>
        <Box
        display='flex' flexWrap='wrap' alignItems='center' justifyContent='space-between'
        >
          {jsonErrorRecords.length === 0 ? '' : (
            <Button
              onClick={() => alert(jsonErrorRecords.join(','))}
              size='small'
              icon='warning'
              variant='danger'
              marginRight={2}
              aria-label="GeoJSON Error"
            ></Button>
          )}
          <SelectButtons
            value={value}
            onChange={newValue => setValue(newValue)}
            options={appMode}
            size='small'
            width='160px'
            marginRight={2}
          />
          <Switch
            value={showBackground}
            onChange={newValue => setShowBackground(newValue)}
            label='Background'
            size='small'
            width='auto'
            marginRight={2}
          />
          <Switch
            value={showConditions}
            onChange={newValue => setShowConditions(newValue)}
            label='Conditions'
            size='small'
            width='auto'
          />
        </Box>
        <Button
          onClick={() => console.log('Button clicked')}
          size='small'
          icon='download'
        >
          PDF
        </Button>
        <Button
          display='none'
          onClick={() => console.log('Button clicked')}
          size='small'
          icon='upload'
        >
          Save
        </Button>
      </Box>
      <Box position='relative' flexGrow={1}>
        <MapBox
          accessToken={settings.mapboxAccessToken}
          activeView={activeView}
          geoJsonColumn={settings.mapboxJsonTitle}
          records={records}
          selectRecord={(id) => setCurrentRecordIds([id])}
          setJsonErrorRecords={(ids) => {
            if(jsonErrorRecords.length !== ids.length) setJsonErrorRecords(ids);
          }}
        />
      </Box>
      <Box height='100px'>
        <Text
          display='none'
          alignItems='center'
          justifyContent='center'
          overflow='hiddden'
          height='80px'
          margin='10px'
          borderRadius='3px'
          boxShadow='rgba(0, 0, 0, 0.1) 0px 0px 0px 2px'
        >
          Select a record from Airtable or a shape on the map.
        </Text>
        <RecordCardList records={selectedRecords} />
      </Box>
    </>
  );
}

export default App;
