export function getRecordsById(records, ids) {
  const recordMap = new Map();
  records.forEach(record => recordMap.set(record.id, record));

  return ids
    .filter(id => recordMap.has(id))
    .map(id => recordMap.get(id));
}
