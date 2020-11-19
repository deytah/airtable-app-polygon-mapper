import {cursor} from '@airtable/blocks';
import {recordColoring} from '@airtable/blocks/models';
import {
  useBase,
  useRecords,
  useWatchable
} from '@airtable/blocks/ui';

function useMapData(geoJsonColumn) {
  useWatchable(cursor, ['activeTableId', 'activeViewId']);

  const base = useBase();
  const activeTable = base.getTableByIdIfExists(cursor.activeTableId);
  const activeView = activeTable.getViewByIdIfExists(cursor.activeViewId);

  if (activeTable.getFieldIfExists(geoJsonColumn) === null) {
    return []
  }

  const records = useRecords(activeTable, {
    recordColorMode: recordColoring.modes.byView(activeView)
  });

  return records.filter(record => record.getCellValue(geoJsonColumn)).map(record => {
    const source = {
      type: 'Feature',
      geometry: JSON.parse(record.getCellValue('Geometry').replace('"geometry": ', '')),
      properties: {
        id: record.id,
        name: record.name
      }
    };

    try {
      const color = record.getColorHexInView(activeView);
      if (color) {
        source.properties.color = color;
      }
    } catch(e) {}

    // return JSON.parse(record.getCellValue(geoJsonColumn))
    return source;
  });
}

export default useMapData;
