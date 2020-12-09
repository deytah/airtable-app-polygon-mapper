import {useBase, useGlobalConfig} from '@airtable/blocks/ui';

export const ConfigKeys = {
    MAPBOX_ACCESS_TOKEN: 'mapboxAccessToken',
    MAPBOX_JSON_TITLE: 'mapboxJsonTitle',
    MAPBOX_LABEL_FIELD: 'mapboxLabelField',
};

function getSettings(globalConfig) {
    const mapboxAccessToken = globalConfig.get(ConfigKeys.MAPBOX_ACCESS_TOKEN);
    const mapboxJsonTitle = globalConfig.get(ConfigKeys.MAPBOX_JSON_TITLE);
    const mapboxLabelField = globalConfig.get(ConfigKeys.MAPBOX_LABEL_FIELD);

    return {
        mapboxAccessToken,
        mapboxJsonTitle,
        mapboxLabelField,
    };
}

function getSettingsValidationResult(settings) {
    const {
      mapboxAccessToken,
      mapboxJsonTitle
    } = settings;

    let isValid = true;
    let message = null;
    if (!mapboxAccessToken) {
        // If token is not entered...
        isValid = false;
        message = 'Please enter your Mapbox Public Access Token';
    }
    if (!mapboxJsonTitle) {
        // If GeoJSON field is not entered...
        isValid = false;
        message = 'Please enter where your GeoJSON is stored.';
    }

    return {
        isValid,
        message,
        settings,
    };
}

export function useSettings() {
    const base = useBase();
    const globalConfig = useGlobalConfig();
    const settings = getSettings(globalConfig, base);
    return getSettingsValidationResult(settings);
}
