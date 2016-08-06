'use strict';

/*
 * Node script to aggregate markets data.
 */

/* jslint node: true */

var path = require('path');

var utils = require('./utils');


var CITIES_DIR = path.join(__dirname, '..', 'cities');
var CITIES_FILE = path.join(CITIES_DIR, 'cities.json');

var BUILD_DIR = path.join(__dirname, '..', 'build');
var AGGREGATED_MARKETS_FILE = path.join(BUILD_DIR, 'markets.json');


/*
 * Merge two or more GeoJSON objects.
 *
 * Takes a `target` GeoJSON object and one or more source GeoJSON objects and
 * merges the features from the source objects into the target object. Note
 * that other GeoJSON data from the sources (e.g. `metadata`) is *not* copied.
 *
 * The target object is returned.
 */
function mergeGeoJSONFeatures(target /* , args */) {
    if (target.features === undefined) {
        target.features = [];
    }
    for (let i = 1; i < arguments.length; i++) {
        Array.prototype.push.apply(target.features, arguments[i].features);
    }
    return target;
}


/*
 * Aggregate markets data from all cities.
 *
 * Loads each city's GeoJSON data and merges all GeoJSON features into a single
 * file (`AGGREGATED_MARKETS_FILE`).
 *
 * Returns a promise that resolves to the output filename once all data has
 * been aggregated and written to disk.
 */
function aggregateMarketsData() {
    return utils.loadJSON(CITIES_FILE)
        .then(json => {
            let aggregated = {
                "crs": {
                    "properties": {
                        "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
                    },
                    "type": "name"
                },
                "type": "FeatureCollection",
                "features": []
            };
            let promises = [];
            for (let city in json) {
                let p = utils.loadJSON(path.join(CITIES_DIR, city + '.json'))
                    .then(cityJSON => mergeGeoJSONFeatures(aggregated, cityJSON));
                promises.push(p);
            }
            promises.push(utils.ensureDir(BUILD_DIR));
            return Promise.all(promises)
                .then(values => utils.saveJSON(aggregated, AGGREGATED_MARKETS_FILE));
        });
}


if (require.main === module) {
    aggregateMarketsData()
        .then(filename => console.log('Markets data has been aggregated to ' +
                                      filename))
        .catch(err => console.error(err));
}

