import polylabel from 'polylabel';
import * as d3 from 'd3';

export default function findPoint(feature) {
    let output = [];
    if (feature.geometry.type === 'Polygon') {
        output = polylabel(feature.geometry.coordinates);
    } else if (feature.geometry.type === 'MultiPolygon'){
        let maxArea = 0, maxPolygon = [];
        for (let i = 0, l = feature.geometry.coordinates.length; i < l; i++) {
            const p = feature.geometry.coordinates[i];
            const area = d3.geoArea({type: 'Polygon', coordinates: p})
            if (area > maxArea) {
                maxPolygon = p;
                maxArea = area;
            }
        }
        output = polylabel(maxPolygon);
    }

    // TODO Handle other feature types

    return output;
}
