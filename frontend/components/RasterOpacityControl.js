import React, {useEffect, useState} from 'react';
import {base} from '@airtable/blocks';
import {Box} from "@airtable/blocks/ui";
import {updateOpacity} from "../map/addImagesSources";

export function RasterOpacityControl({map}) {
  const storageKey = `mapbox_image_opacity_${base.id}`;
  const [percentage, setPercentage] = useState(localStorage.getItem(storageKey) || 85);


  useEffect(() => {
    console.log('running')
    updateOpacity(map, parseInt(percentage, 10) / 100);
    localStorage.setItem(storageKey, percentage);
  }, [map, percentage]);

  return (
    <Box
      className="mapboxgl-ctrl-group"
      position="absolute"
      display="flex"
      alignItems="center"
      top={0}
      left={0}
      zIndex="5"
      margin={2}
      padding={2}
    >
      <label htmlFor="slider">Image opacity</label>
      <input
        id="slider"
        type="range"
        min="0"
        max="100"
        step="0"
        style={{margin: '0 .5em'}}
        value={percentage}
        onChange={event => setPercentage(event.target.value)}
      />
      <span id="slider-value">{percentage}%</span>
    </Box>
  );
}
