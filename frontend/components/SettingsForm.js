import React, {useEffect, useState} from 'react';
import {
  Box,
  Button,
  FieldPickerSynced,
  FormField,
  InputSynced,
  Switch,
  TablePickerSynced,
  Text,
  useBase,
  useGlobalConfig,
  Heading,
} from '@airtable/blocks/ui';

import {useSettings, ConfigKeys} from '../hooks/settings';
import {FieldType} from "@airtable/blocks/models";

function SettingsForm({setIsSettingsOpen}) {
  const globalConfig = useGlobalConfig();

  const {
    isValid,
    message,
    settings: {
      images
    },
  } = useSettings();

  const [imagesEnabled, setImagesEnabled] = useState(!!images.table);

  const base = useBase();
  const table = images.table ? base.getTableById(images.table) : null;

  const geometryFieldTypes = [
    FieldType.FORMULA,
    FieldType.MULTILINE_TEXT,
    FieldType.MULTIPLE_LOOKUP_VALUES,
    FieldType.ROLLUP,
    FieldType.SINGLE_LINE_TEXT,
  ];

  useEffect(() => {
    if (!imagesEnabled) {
      globalConfig.setAsync(ConfigKeys.IMAGES_TABLE, null).then();
      globalConfig.setAsync(ConfigKeys.IMAGES_FIELD, null).then();
      globalConfig.setAsync(ConfigKeys.IMAGES_GEOMETRY_FIELD, null).then();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagesEnabled]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      justifyContent="flex-start"
    >
      <Box flex="auto" padding={4} paddingBottom={2}>
        <Heading marginBottom={3}>Settings</Heading>
        <FormField
          label="Mapbox Public Access Token"
          description="Available at https://account.mapbox.com/"
        >
          <InputSynced
            globalConfigKey={ConfigKeys.MAPBOX_ACCESS_TOKEN}
          />
        </FormField>
        <FormField
          label="Geometry Field Name"
          description='Must be the same for all tables. This is the "geometry" part of a GeoJSON feature.'
        >
          <InputSynced
            globalConfigKey={ConfigKeys.GEOMETRY_FIELD}
          />
        </FormField>
        <FormField
          label="Label Field Name (Defaults to the primary field.)"
          description="Must be the same for all tables."
        >
          <InputSynced
            globalConfigKey={ConfigKeys.LABEL_FIELD}
          />
        </FormField>

        <Heading marginBottom={3} size={"small"}>Placed Images</Heading>

        <FormField>
          <Switch label={'Enable'} value={imagesEnabled} onChange={v => setImagesEnabled(v)}/>
        </FormField>
        {imagesEnabled && (<>
          <FormField
            label="Table"
            description="Set to none to disable."
          >
            <TablePickerSynced
              globalConfigKey={ConfigKeys.IMAGES_TABLE}
            />
          </FormField>
          {images.table && (<>
            <FormField
              label="Images Field"
              description="Must be the same for all tables."
            >
              <FieldPickerSynced
                table={table}
                globalConfigKey={ConfigKeys.IMAGES_FIELD}
                allowedTypes={[FieldType.MULTIPLE_ATTACHMENTS, FieldType.MULTIPLE_LOOKUP_VALUES]}
              />
            </FormField>
            <FormField
              label="Geometry Field"
              description="Must be the same for all tables."
            >
              <FieldPickerSynced
                table={table}
                globalConfigKey={ConfigKeys.IMAGES_GEOMETRY_FIELD}
                allowedTypes={geometryFieldTypes}
              />
            </FormField>
          </>)}
        </>)}
      </Box>
      <Box display="flex" flex="none" padding={3} borderTop="thick" justifySelf="flex-end">
        <Box
          flex="auto"
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          paddingRight={2}
        >
          <Text textColor="light">{message}</Text>
        </Box>
        <Button
          disabled={!isValid}
          size="large"
          variant="primary"
          onClick={() => setIsSettingsOpen(false)}
        >
          Done
        </Button>
      </Box>
    </Box>
  );
}

export default SettingsForm;
