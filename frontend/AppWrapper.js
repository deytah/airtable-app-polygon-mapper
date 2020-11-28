import React, { useRef, useEffect, useState } from 'react';

import {cursor} from '@airtable/blocks';
import {recordColoring} from '@airtable/blocks/models';
import {
    useBase,
    useLoadable,
    useWatchable,
    Box,
    Text
} from '@airtable/blocks/ui';

import App from './App';

function AppWrapper({settings}) {
  useLoadable(cursor);

  // Watch
  useWatchable(cursor, ['activeTableId', 'activeViewId']);

  // Data
  const base = useBase();
  if(!cursor.activeViewId || !cursor.activeViewId) {
    return '';
  }
  const activeTable = base.getTableByIdIfExists(cursor.activeTableId);
  const activeView = activeTable.getViewByIdIfExists(cursor.activeViewId);

  if (activeTable.getFieldByNameIfExists(settings.mapboxJsonTitle) === null) {
    return (
      <Box padding={2} display="flex" alignItems="center" justifyContent="center" height="100%">
        <Text>
          GeoJSON field "{settings.mapboxJsonTitle}" not found for the current table.
        </Text>
      </Box>
    );
  }

  return (
    <App settings={settings}
         activeTable={activeTable}
         activeView={activeView}
   />
  );
}

export default AppWrapper;
