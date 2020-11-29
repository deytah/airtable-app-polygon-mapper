import React, { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';

import {base} from '@airtable/blocks';
import {
	Box,
	Button,
  Dialog,
  FormField,
  Heading,
  Input,
  Select
} from '@airtable/blocks/ui';

import mapboxgl from 'mapbox-gl';
import * as printPdf from 'mapbox-print-pdf';

// Options
const paperOrientations = [
  { value: "landscape", label: "Landscape" },
  { value: "portrait", label: "Portrait" }
];
const paperFormats = [
  { value: "a4", label: "A4" },
  { value: "letter", label: "Letter" }
];

function getFooter(attributionText) {
  return (
    <>
      <div style={{padding: '4pt 8pt 8pt'}}>
        <p data-scale-sum="font-size" style={{fontSize: '10pt', margin: '0'}}>Created with: © Mapbox, © OpenStreetMap</p>
        { attributionText && <p data-scale-sum="font-size" style={{fontSize: '10pt', margin: '0'}}>{attributionText}</p> }
      </div>
    </>
  );
}

export default function SaveMapDialog({
  closeDialog,
  map
}) {
  // Key for storing temporary preferences
  const storagePrefsKey = `mapbox_prefs_${base.id}`;
  // Load storage preferences
  const storagePrefs = (
    localStorage.getItem(storagePrefsKey) && JSON.parse(localStorage.getItem(storagePrefsKey))
  ) || { // Defaults
    attributionText: '',
    paperFormat: 'a4',
    paperOrientation: 'landscape'
  };

  const [attributionText, setAttributionText] = useState(storagePrefs.attributionText);
  const [paperFormat, setPaperFormat] = useState(storagePrefs.paperFormat);
  const [paperOrientation, setPaperOrientation] = useState(storagePrefs.paperOrientation);

  useEffect(() => {
    localStorage.setItem(storagePrefsKey, JSON.stringify({
      attributionText,
      paperFormat,
      paperOrientation
    }))
  }, [attributionText, paperFormat, paperOrientation]);

  function save() {
    const footer = ReactDOMServer.renderToString(getFooter(attributionText));
    console.log(footer);
    printPdf.build()
        .format(paperFormat)[paperOrientation]()
        .footer({
          html: footer,
          baseline: {
            format: paperFormat,
            // orientation: paperOrientation
          }
        })
        .print(map, mapboxgl)
        .then(function(pdf) {
          pdf.save('map.pdf');
          closeDialog();
        });
  }

	return (
		<Dialog onClose={closeDialog} minWidth="320px" maxWidth="530px">
			<Dialog.CloseButton />
			<Heading paddingTop={2}>Save Map Canvas</Heading>
      <Box
        display="flex"
        justifyContent="space-between"
      >
        <FormField
          label="Orientation"
          marginRight={1}
        >
          <Select
            options={paperOrientations}
            value={paperOrientation}
            onChange={newValue => setPaperOrientation(newValue)}
          />
        </FormField>
        <FormField
          label="Format"
          marginLeft={1}
        >
          <Select
            options={paperFormats}
            value={paperFormat}
            onChange={newValue => setPaperFormat(newValue)}
          />
        </FormField>
      </Box>
      <FormField
        label="Attribution Text"
        description="Add an attribution line for your dataset to the map."
      >
        <Input
          value={attributionText}
          onChange={e => setAttributionText(e.target.value)}
        />
      </FormField>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        marginY={2}
      >
        <Button
          onClick={closeDialog}>
            Cancel
        </Button>
        <Button
          marginLeft={2}
          variant="primary"
          onClick={save}>
            Download
        </Button>
      </Box>
		</Dialog>
	)
}