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
var AGGREGATED_CITIES_FILE = path.join(BUILD_DIR, 'cities.json');
var AGGREGATED_MARKETS_FILE = path.join(BUILD_DIR, 'markets.json');


/*
 * Merge the features of GeoJSON objects.
 *
 * Takes a `target` GeoJSON object and a list `sources` of one or more source
 * GeoJSON objects and merges the features from the source objects into the
 * target object. Note that other GeoJSON data from the sources is *not*
 * copied.
 *
 * The target object is returned.
 */
function mergeFeatures(target, sources) {
    if (target.features === undefined) {
        target.features = [];
    }
    for (let source of sources) {
        Array.prototype.push.apply(target.features, source.features);
    }
    return target;
}


/*
 * Aggregate data from all cities.
 *
 * Loads each city's GeoJSON data and merges all GeoJSON features into a single
 * file (`AGGREGATED_MARKETS_FILE`). All metadata is merged into a separate
 * file (`AGGREGATED_CITIES_FILE`).
 *
 * Returns two promises that resolve to the output filenames once all data has
 * been aggregated and written to disk.
 */
function aggregate() {
    return utils.loadJSON(CITIES_FILE)
        .then(citiesJSON => {
            let marketsJSON = {
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
            for (let city in citiesJSON) {
                let p = utils.loadJSON(path.join(CITIES_DIR, city + '.json'));
                promises.push(p.then(cityJSON => {
                    for (let key in cityJSON.metadata) {
                        citiesJSON[city][key] = cityJSON.metadata[key];
                    }
                }));
                promises.push(p.then(cityJSON =>
                    mergeFeatures(marketsJSON, [cityJSON])));
            }
            promises.push(utils.ensureDir(BUILD_DIR));
            let p = Promise.all(promises);
            return [
                p.then(_ => utils.saveJSON(citiesJSON, AGGREGATED_CITIES_FILE)),
                p.then(_ => utils.saveJSON(marketsJSON, AGGREGATED_MARKETS_FILE))
            ];
        });
}


if (require.main === module) {
    aggregate()
        .then(_ => {
            console.log('Markets data has been aggregated to ' +
                        AGGREGATED_MARKETS_FILE);
            console.log('Cities metadata has been aggregated to ' +
                        AGGREGATED_CITIES_FILE);
        })
        .catch(err => console.error(err));
}

