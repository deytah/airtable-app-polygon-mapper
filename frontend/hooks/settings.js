import {useBase, useGlobalConfig} from '@airtable/blocks/ui';

export const ConfigKeys = {
    MAPBOX_ACCESS_TOKEN: 'mapboxAccessToken',
    GEOMETRY_FIELD: 'mapboxJsonTitle',
    LABEL_FIELD: 'mapboxLabelField',
    IMAGES_FIELD: 'mapboxImagesField',
    IMAGES_GEOMETRY_FIELD: 'mapboxImagesGeometryField',
    IMAGES_TABLE: 'mapboxImagesTable',
};

function getSettings(globalConfig) {
    return {
        mapboxAccessToken: globalConfig.get(ConfigKeys.MAPBOX_ACCESS_TOKEN),
        geometryField: globalConfig.get(ConfigKeys.GEOMETRY_FIELD),
        labelField: globalConfig.get(ConfigKeys.LABEL_FIELD),
        images: {
            table: globalConfig.get(ConfigKeys.IMAGES_TABLE),
            geometryField: globalConfig.get(ConfigKeys.IMAGES_GEOMETRY_FIELD),
            imageField: globalConfig.get(ConfigKeys.IMAGES_FIELD),
        },
    };
}

function getSettingsValidationResult(base, settings) {
    const {
      mapboxAccessToken,
      geometryField,
      images,
    } = settings;

    let isValid = true;
    let message = null;
    if (!mapboxAccessToken) {
        // If token is not entered
        isValid = false;
        message = 'Please enter your Mapbox Public Access Token';
    }

    if (!geometryField) {
        // If GeoJSON field is not entered
        isValid = false;
        message = 'Please enter where your GeoJSON is stored.';
    }

    if (images.table) {
        const table = base.getTableByIdIfExists(images.table);
        if (!table) {
            isValid = false;
            message = 'Invalid table selected for images.';
        } else if (!images.imageField) {
            isValid = false;
            message = 'No field selected for images.';
        } else if (!table.getFieldByIdIfExists(images.imageField)) {
            isValid = false;
            message = 'Selected field for images does not exist.';
        } else if (!images.geometryField) {
            isValid = false;
            message = 'No field selected for images\' geometry.';
        } else if (!table.getFieldByIdIfExists(images.geometryField)) {
            isValid = false;
            message = 'Selected field for images\' geometry does not exist.';
        }
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
    return getSettingsValidationResult(base, settings);
}
