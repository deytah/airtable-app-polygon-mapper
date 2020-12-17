// TODO This should be changed out as soon as the project has a fixed npm audit
import MapboxDraw from './mapbox-gl-draw';

const draw = new MapboxDraw({
  displayControlsDefault: false,
  controls: {
    polygon: true,
    trash: true
  }
});

let dirty = false;
let drawing = false;

function init(map) {
  function cudEvent() {
    dirty = true;
  }

  map.on('draw.create', cudEvent);
  map.on('draw.delete', cudEvent);
  map.on('draw.update', cudEvent);

  map.on('draw.modechange', (event) => {
    if (event.mode.substring(0, 5) === 'draw_') {
      drawing = true;
    } else if (drawing) {
      setTimeout(() => drawing = false, 100);
    }
  });
}

function toggle(map, state) {
  if (state) {
    !map.hasControl(draw) && map.addControl(draw);
  } else {
    if (map.hasControl(draw)) {
      map.removeControl(draw);
      dirty = false;
      drawing = false;
    }
  }
}

function get() {
  const features = draw.getAll().features;
  if (features.length > 0) {
    const geometry = features[0].geometry;
    if (features.length > 1) {
      geometry.type = 'MultiPolygon';
      geometry.coordinates = features.map(feature => feature.geometry.coordinates);
    }
    return geometry;
  }
  return null;
}

function reset(map) {
  if (map.hasControl(draw)) {
    draw.deleteAll();
  }
  dirty = false;
  drawing = false;
}

export const polygonEditor = {
  add: draw.add,
  get,
  init,
  isActive: (map) => map.hasControl(draw),
  isDirty: () => dirty,
  isDrawing: () => drawing,
  reset,
  saved: () => dirty = false,
  toggle,
};
