import PropTypes from 'prop-types';
import React from 'react';
import {
    useGlobalConfig,
    Box,
    Button,
    FormField,
    Heading,
    InputSynced,
    Text,
} from '@airtable/blocks/ui';

import {useSettings, ConfigKeys} from '../hooks/settings';

function SettingsForm({setIsSettingsOpen}) {
    // const globalConfig = useGlobalConfig();
    const {
        isValid,
        message,
        // settings: {mapboxAccessToken, mapboxJsonTitle},
    } = useSettings();

    // const canUpdateSettings = globalConfig.hasPermissionToSet();

    return (
        <Box
            position="absolute"
            top={0}
            bottom={0}
            left={0}
            right={0}
            display="flex"
            flexDirection="column"
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
                  label="GeoJSON Field Name"
                  description="Must be the same for all tables."
                >
                  <InputSynced
                    globalConfigKey={ConfigKeys.MAPBOX_JSON_TITLE}
                  />
                </FormField>
                <FormField
                  label="Label Field Name (Defaults to the primary field.)"
                  description="Must be the same for all tables."
                >
                  <InputSynced
                    globalConfigKey={ConfigKeys.MAPBOX_LABEL_FIELD}
                  />
                </FormField>
            </Box>
            <Box display="flex" flex="none" padding={3} borderTop="thick">
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

SettingsForm.propTypes = {
    setIsSettingsOpen: PropTypes.func.isRequired,
};

export default SettingsForm;
