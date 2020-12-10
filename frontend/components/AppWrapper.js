import React from 'react';

import {cursor} from '@airtable/blocks';
import {
    useBase,
    useLoadable,
    useWatchable,
    Box,
    Text,
    ViewportConstraint
} from '@airtable/blocks/ui';

import App from './App';

function Error(message) {
  return (
    <Box padding={2} display="flex" alignItems="center" justifyContent="center" height="100%">
      <Text>{message}</Text>
    </Box>
  )
}

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

  if (activeTable.getFieldByNameIfExists(settings.geometryField) === null) {
    return Error(`Geometry field “${settings.geometryField}” does not exist on this table.`)
  }

  return (
    <ViewportConstraint minSize={{width: 530}}>
      <App
        settings={settings}
        activeTable={activeTable}
        activeView={activeView}
      />
   </ViewportConstraint>
  );
}

export default AppWrapper;
