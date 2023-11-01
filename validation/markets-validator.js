#!/usr/bin/env node
"use strict";

/**
 * Validation for market data
 *
 * This script processes all market files and checks if required and
 * optional attributes are present and set correctly. The opening hours
 * are checked by the opening_hours.js library.
 * If attributes are missing or are misconfigured warnings and errors
 * are output to the console. The script returns and an exit code of 0
 * if no error occured otherwise 1.
 */


import assert from 'assert';
import fs from 'fs';
import path from "path";
import colors from 'colors';
import opening_hours from 'opening_hours';
import http from 'http';
import https from 'https';

function loadPackageJson() {
  const rootPath = fs.realpathSync('.');
  const packageJsonPath = path.join(rootPath, 'package.json');
  const pkgFile = fs.readFileSync(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(pkgFile);
  return packageJson;
}

const pkg = loadPackageJson();

/** 
 * The repository URL is used in the user-agent header in the url
 * status validation (see: MetadataValidator#validateUrlStatus).
 */
var REPO_URL = pkg.repository.url;
assert.ok(REPO_URL, 'missing/invalid repo URL in package.json');

var MARKETS_DIR_PATH = "cities";
var MARKETS_INDEX_FILE_PATH = path.join('cities', 'cities.json');

var MAX_LATITUDE = 90.0;
var MIN_LATITUDE = -90.0;
var MAX_LONGITUDE = 180.0;
var MIN_LONGITUDE = -180.0;

/**
 * In an optimal world there should be zero warnings.
 * Some websites however simply behave strange and it
 * is impossible for us to resolve the issue.
 * The aim is to keep this count as low as possible.
 */
var ACCEPTABLE_WARNINGS_COUNT = 5; // Marl, Essen, Potsdam, Mallorca, Siegen

var exitCode = 0;

var asyncWarnings = [];
var asyncExpiredCertificateIssues = [];
var asyncErrors = [];

colors.setTheme({
    section: 'blue',
    market: 'brightBlue',
    passed: 'green',
    error: 'red',
    info: 'grey',
    warning: 'yellow'
});

/**
 * Reads in the cities.json file and compares the key with the corresponding ids.
 * If one or more does not match it exits with 1.
 */

fs.readFile(MARKETS_INDEX_FILE_PATH, function(err, data){
    if (err){
        throw err;
    }
    else
    {
        var errorsCount = 0;
        var json = JSON.parse(data);
        Object.getOwnPropertyNames(json).forEach(function(key) {
            if (key == json[key].id){
                console.log("Key of ".passed + key.market + " matches id.".passed);
            }
            else {
                console.error("Key of ".error + key.market + " does not match id.".error);
                errorsCount +=1;
            }

            if (errorsCount !== 0){
                exitCode = 1;
            }
        });
    }
});

/**
 * Reads in the given directory to process market files.
 * For each market file a market validator is created and executed.
 * Returns an exit code depended on the success or failure of the validation.
 */
fs.readdir(MARKETS_DIR_PATH, function (err, files) {
    if (err) {
        throw err;
    }

    var marketCount = 0;
    files.map(function(file) {
        return path.join(MARKETS_DIR_PATH, file);
    }).filter(function(file) {
        return fs.statSync(file).isFile();
    }).forEach(function(file) {
        if (file === MARKETS_INDEX_FILE_PATH || file.substr(-5) !== ".json") {
            return;
        }
        console.log("\n===> Validating %s ...".section, file);
        var marketValidator = new MarketValidator(file);
        marketValidator.validate();
        marketCount++;
        console.log("\n");
    });
    console.log(marketCount + " markets validated!");

    console.log('Waiting for asynchronous tasks to finish ...\n');
});

process.on('beforeExit', function () {
    console.log("\n");
    asyncWarnings.forEach(function (warning) {
        console.log("Warning: ".warning + getFormattedText(warning.toString()));
    });

    console.log("\n");
    asyncExpiredCertificateIssues.forEach(function (issue) {
        console.log("Info: ".info + getFormattedText(issue.toString()));
    });

    console.log("\n");
    asyncErrors.forEach(function (error) {
        console.log("Error: ".error + error.toString());
    });

    var warningsCount = asyncWarnings.length;
    if (warningsCount > ACCEPTABLE_WARNINGS_COUNT) {
        printSupportRequest(warningsCount);
        exitCode = 1;
    }

    process.exitCode = exitCode;
});

/**
  * Returns the given issue or warning text formatted with colors.
  * Text parts such as the market name, the status code and the new location URL are emphasized.
  *
  * - text Issue or warning text delimited by colons and line breaks.
  */
function getFormattedText(text) {
    var formattedText = "";
    var parts = text.split(":");
    if (parts.length < 2) {
        return text;
    }
    formattedText += parts[0].market + ":";
    formattedText += parts[1];
    if (parts.length == 3) {
        formattedText += ":" + parts[2].error;
    }
    if (parts.length > 3 && parts[2].includes("\n")) {
        var linebreakPart = parts[2].split("\n");
        formattedText += ":" + linebreakPart[0].error + "\n";
        formattedText += linebreakPart[1];
        for (var i = 3; i < parts.length; i++) {
            formattedText += ":" + parts[i].warning;
        }
    } else if (parts.length > 3) {
        for (var j = 3; j < parts.length; j++) {
            formattedText += ":" + parts[j].warning;
        }
    }
    return formattedText;
}

/**
 * Outputs a message to the console in order to engage the developer to fix issues.
 *
 * - warningsCount Number of warnings detected
 */
function printSupportRequest(warningsCount) {
    console.log("--------------------------------------------------------------------------------------------------");
    console.log("YOUR HELP IS NEEDED. PLEASE SUPPORT THIS PROJECT.\n".warning);
    console.log(warningsCount + " warnings have been detected. These exceed the acceptable number of " + ACCEPTABLE_WARNINGS_COUNT + ".");
    console.log("Please take the time to fix some of the issues even if they are not related to your pull request.");
    console.log("Please add the fix in a separate commit.");
    console.log("--------------------------------------------------------------------------------------------------\n");
}

/**
 * Validator for a market file.
 * Outputs warnings and errors to the console.
 * Updates the global exit code.
 *
 * - filePath: Path to the market file
 */
function MarketValidator(filePath) {

    this.filePath = filePath;
    this.errorsCount = 0;
    this.warningsCount = 0;

    this.validate = function() {
        var data = fs.readFileSync(this.filePath, 'utf8');
        var json = JSON.parse(data);
        var features = json.features;
        var cityName = this.getCityName();

        var featuresValidator = new FeaturesValidator(features, cityName);
        featuresValidator.validate();
        featuresValidator.printIssues();
        this.errorsCount += featuresValidator.getErrorsCount();
        this.warningsCount += featuresValidator.getWarningsCount();

        var metadataValidator = new MetadataValidator(json.metadata, cityName);
        metadataValidator.validate();
        metadataValidator.printWarnings();
        metadataValidator.printErrors();
        this.errorsCount += metadataValidator.getErrorsCount();
        this.warningsCount += metadataValidator.getWarningsCount();

        this.printSummary();

        if (this.errorsCount !== 0) {
            exitCode = 1;
        }
    };

    this.getCityName = function() {
        return path.basename(this.filePath, path.extname(this.filePath));
    };


    this.printSummary = function() {
        if (this.errorsCount === 0) {
            this.printSuccess();

        } else {
            this.printFailure();
        }
    };

    this.printSuccess = function() {
        if (this.warningsCount === 0) {
            console.log("\nValidation PASSED without warnings or errors.".passed);
        } else {
            console.log("\nValidation PASSED with %d warning(s) and no errors.".passed, this.warningsCount);
        }
    };

    this.printFailure = function() {
        console.log("\nValidation done. %d warning(s), %d error(s) detected.".error, this.warningsCount, this.errorsCount);
    };

}

/**
 * Validator for an array of features.
 * Iterates the given features to validate them. After the validation, issues can be printed.
 *
 * - features: Array of features
 * - cityName: Name of the city the features belong to
 */
function FeaturesValidator(features, cityName) {

    this.features = features;
    this.cityName = cityName;
    this.errorsCount = 0;
    this.warningsCount = 0;
    this.featureValidators = [];

    this.validate = function() {
        for (var i = 0, length = features.length; i < length; ++i) {
            var feature = features[i];
            this.validateFeature(feature);
        }
    };

    this.printIssues = function() {
        for (var i = 0, length = this.featureValidators.length; i < length; ++i) {
            var featureValidator = this.featureValidators[i];
            featureValidator.printWarnings();
            featureValidator.printErrors();
        }
    };

    this.validateFeature = function(feature) {
        var featureValidator = new FeatureValidator(feature, this.cityName);
        featureValidator.validate();
        if (featureValidator.hasErrors()) {
            this.errorsCount += featureValidator.getErrorsCount();
        }
        if (featureValidator.hasWarnings()) {
            this.warningsCount += featureValidator.getWarningsCount();
        }
        this.featureValidators.push(featureValidator);
    };

    this.getErrorsCount = function() {
        return this.errorsCount;
    };

    this.getWarningsCount = function() {
        return this.warningsCount;
    };

}

/**
 * Validator for a single feature.
 * After the validation, warnings and errors can be printed.
 *
 * - feature: A single feature
 * - cityName: Name of the city the feature belongs to
 */
function FeatureValidator(feature, cityName) {

    this.feature = feature;
    this.cityName = cityName;
    this.errors = [];
    this.warnings = [];

    this.validate = function() {
        var feature = this.feature;
        if (feature === undefined) {
            this.errors.push(new CustomIssue("Feature cannot be undefined."));
        } else if (feature === null) {
            this.errors.push(new CustomIssue("Feature cannot be null."));
        } else if (feature === {}) {
            this.errors.push(new CustomIssue("Feature cannot be an empty object."));
        } else {
            this.validateGeometry(feature.geometry);
            this.validateProperties(feature.properties);
            this.validateType(feature.type);
        }
    };

    this.printErrors = function() {
        if (this.hasErrors()) {
            this.printMarketTitle();
        }
        for (var i = 0, length = this.errors.length; i < length; ++i) {
            var error = this.errors[i];
            console.log("Error: %s", error.toString());
        }
    };

    this.printWarnings = function() {
        if (this.hasWarnings()) {
            this.printMarketTitle();
        }
        for (var i = 0, length = this.warnings.length; i < length; ++i) {
            var warning = this.warnings[i];
            console.log("Warning: %s", warning.toString());
        }
    };

    this.validateProperties = function(properties) {
        if (properties === undefined) {
            this.errors.push(new UndefinedAttributeIssue("properties"));
        } else if (properties === null) {
            this.errors.push(new NullAttributeIssue("properties"));
        } else if (properties === {}) {
            this.errors.push(new EmptyObjectIssue("properties"));
        } else {
            this.validateTitle(properties.title);
            this.validateLocation(properties.location);
            var openingHours = properties.opening_hours;
            var openingHoursUnclassified = properties.opening_hours_unclassified;
            if (openingHours === null) {
                this.validateOpeningHoursIsNull(openingHours);
                this.validateOpeningHoursUnclassifiedIsNotNull(openingHoursUnclassified);
            } else {
                this.validateOpeningHours(openingHours);
                this.validateOpeningHoursUnclassifiedIsNull(openingHoursUnclassified);
            }
        }
    };

    this.validateTitle = function(title) {
        if (title === undefined) {
            this.errors.push(new UndefinedAttributeIssue("title"));
        } else if (title === null) {
            this.errors.push(new NullAttributeIssue("title"));
        } else if (title.length === 0) {
            this.errors.push(new EmptyAttributeIssue("title"));
        }
    };

    this.validateLocation = function(location) {
        if (location === undefined) {
            this.errors.push(new UndefinedAttributeIssue("location"));
        } else if (location === null) {
            // Attribute "location" is optional.
        } else if (location.length === 0) {
            this.errors.push(new EmptyAttributeIssue("location"));
        }
    };

    this.validateOpeningHours = function(openingHours) {
        if (openingHours === undefined) {
            this.errors.push(new UndefinedAttributeIssue("opening_hours"));
            return;
        }
        var oh;
        try {
            var options = {
                "address" : {
                    "country_code" : "de"
                }
            };
            oh = new opening_hours(openingHours, options);
            var warnings = oh.getWarnings();
            if (warnings.length > 0) {
                this.errors.push(warnings);
            }
        } catch (error) {
            this.errors.push(error.toString());
        }
    };

    this.validateOpeningHoursIsNull = function(openingHours) {
        if (openingHours !== null) {
            this.errors.push(new CustomIssue(
                "Attribute 'opening_hours' must be null when 'opening_hours_unclassified' is used."));
        }
    };

    this.validateOpeningHoursUnclassifiedIsNull = function(openingHoursUnclassified) {
        if (openingHoursUnclassified === undefined) {
            // Attribute "opening_hours_unclassified" is optional.
            return;
        }
        if (openingHoursUnclassified !== null) {
            this.errors.push(new CustomIssue(
                "Attribute 'opening_hours_unclassified' must be null when 'opening_hours' is used."));
        }
    };

    this.validateOpeningHoursUnclassifiedIsNotNull = function(openingHoursUnclassified) {
        if (openingHoursUnclassified === undefined) {
            this.errors.push(new CustomIssue(
                "Attribute 'opening_hours_unclassified' cannot be undefined when 'opening_hours' is null."));
        } else if (openingHoursUnclassified === null) {
            this.errors.push(new CustomIssue(
                "Attribute 'opening_hours_unclassified' cannot be null when 'opening_hours' is null."));
        } else if (openingHoursUnclassified === "") {
            this.errors.push(new CustomIssue(
                "Attribute 'opening_hours_unclassified' cannot be empty when 'opening_hours' is null."));
        }
    };

    this.validateGeometry = function(geometry) {
        if (geometry === undefined) {
            this.errors.push(new UndefinedAttributeIssue("geometry"));
        } else if (geometry === null) {
            this.errors.push(new NullAttributeIssue("geometry"));
        } else if (geometry === {}) {
            this.errors.push(new EmptyObjectIssue("geometry"));
        } else {
            this.validateCoordinates(geometry.coordinates);
            this.validateGeometryType(geometry.type);
        }
    };

    this.validateCoordinates = function(coordinates) {
        if (coordinates === undefined) {
            this.errors.push(new UndefinedAttributeIssue("coordinates"));
        } else if (coordinates === null) {
            this.errors.push(new NullAttributeIssue("coordinates"));
        } else if (coordinates.length !== 2) {
            this.errors.push(new CustomIssue(
                "Attribute 'coordinates' must contain two values not " + coordinates.length + "."));
        } else {
            var lon = coordinates[0];
            if (!longitudeInValidRange(lon)) {
                this.errors.push(new LongitudeRangeExceedanceIssue("coordinates[0]", lon));
            }
            var lat = coordinates[1];
            if (!latitudeInValidRange(lat)) {
                this.errors.push(new LatitudeRangeExceedanceIssue("coordinates[1]", lat));
            }
        }
    };

    this.validateGeometryType = function(type) {
        if (type !== "Point") {
            this.errors.push(new CustomIssue(
                "Attribute 'geometry.type' must be 'Point' not '" + type + "'."));
        }
    };

    this.validateType = function(type) {
        if (type !== "Feature") {
            this.errors.push(new CustomIssue(
                "Attribute 'type' must be 'Feature' not '" + type + "'."));
        }
    };

    this.getErrorsCount = function() {
        return this.errors.length;
    };

    this.getWarningsCount = function() {
        return this.warnings.length;
    };

    this.hasErrors = function() {
        return this.errors.length > 0;
    };

    this.hasWarnings = function() {
        return this.warnings.length > 0;
    };

    this.printMarketTitle = function() {
        console.log("\n%s: %s".market,
            this.cityName.toUpperCase(),
            this.feature.properties.title);
    };

}

/**
 * Validator for a the "metadata" attribute.
 * After the validation, warnings and errors can be printed.
 *
 * - metadata: The "metadata" attribute
 */
function MetadataValidator(metadata, cityName) {

    this.metadata = metadata;
    this.cityName = cityName;
    this.errors = [];
    this.warnings = [];

    this.validate = function() {
        var metadata = this.metadata;
        if (metadata === undefined) {
            this.errors.push(new UndefinedAttributeIssue("metadata"));
        } else if (metadata === null) {
            this.errors.push(new NullAttributeIssue("metadata"));
        } else {
            this.validateDataSource(metadata.data_source);
            this.validateMapInitialization(metadata.map_initialization);
        }
    };

    this.printErrors = function() {
        for (var i = 0, length = this.errors.length; i < length; ++i) {
            var error = this.errors[i];
            console.log(error.toString());
        }
    };

    this.printWarnings = function() {
        for (var i = 0, length = this.warnings.length; i < length; ++i) {
            var warning = this.warnings[i];
            console.log(warning.toString());
        }
    };

    this.validateDataSource = function(dataSource) {
        if (dataSource === undefined) {
            this.errors.push(new UndefinedAttributeIssue("data_source"));
        } else if (dataSource === null) {
            this.errors.push(new NullAttributeIssue("data_source"));
        } else {
            this.validateTitle(dataSource.title);
            this.validateUrl(dataSource.url);
        }
    };

    this.validateTitle = function(title) {
        if (title === undefined) {
            this.errors.push(new UndefinedAttributeIssue("title"));
        } else if (title === null) {
            this.errors.push(new NullAttributeIssue("title"));
        } else if (title.length === 0) {
            this.errors.push(new EmptyAttributeIssue("title"));
        }
    };

    this.validateUrl = function(url) {
        if (url === undefined) {
            this.errors.push(new UndefinedAttributeIssue("url"));
        } else if (url === null) {
            this.errors.push(new NullAttributeIssue("url"));
        } else if (url.length === 0) {
            this.errors.push(new EmptyAttributeIssue("url"));
        } else {
            this.validateUrlStatus(url);
        }
    };

    this.validateUrlStatus = function(url) {
        url = new URL(url);

        var client;
        switch(url.protocol) {
            case 'http:': client = http; break;
            case 'https:': client = https; break;
            default:
                this.warnings.push(new UnknownProtocolIssue(url.protocol));
                return;
        }

        function handleResponse(response) {
            if (response.statusCode >= 300 && response.statusCode < 400) {
                asyncWarnings.push(new HttpRedirectStatusIssue(cityName, response.statusCode, response.headers.location));
            } else if (response.statusCode !== 200) {
                asyncWarnings.push(new HttpResponseStatusIssue(cityName, response.statusCode));
            }
        }

        function handleError(error) {
            if (error == "Error: certificate has expired") {
                asyncExpiredCertificateIssues.push(new ExpiredCertificateIssue(cityName));
            } else {
                asyncWarnings.push(new HttpRequestErrorIssue(cityName, error));
            }
        }

        var requestParameters = {
            method: 'HEAD',
            timeout: 10000, // 10 seconds
            headers: {
                'Cookie': 'mobile=0', // for Zwickau
                'User-Agent': REPO_URL,
                'Accept': '*/*',
            },
        };

        function executeRequest(url, requestParameters, fallbackRequest) {
            var request = client.request(url, requestParameters, function(response) {
                // Cleaning up HTTP request and response
                response.destroy();
        
                if (response.statusCode !== 200 && response.statusCode !== 307) {
                    if (fallbackRequest) {
                        fallbackRequest(url, requestParameters);
                    } else {
                        handleResponse(response);
                    }
                }
            });
            request.on('error', handleError);
            request.end();
        }

        executeRequest(url, requestParameters, function() {
            /* It looks like some server (yes I'm looking at you "Basel") do not allow HEAD request.
            * So in that case we try a GET instead. See issue#388 for details*/
            requestParameters.method = 'GET';
            executeRequest(url, requestParameters);
        });
    };

    this.validateMapInitialization = function(mapInitialization) {
        if (mapInitialization !== undefined) {
            this.errors.push(new ObsoleteIssue("map_initialization"));
        }
    };

    this.getErrorsCount = function() {
        return this.errors.length;
    };

    this.getWarningsCount = function() {
        return this.warnings.length;
    };

    this.hasErrors = function() {
        return this.errors.length > 0;
    };

    this.hasWarnings = function() {
        return this.warnings.length > 0;
    };

}


// Validation of latitude and longitude

function latitudeInValidRange(lat) {
    return (lat > MIN_LATITUDE && lat <= MAX_LATITUDE);
}

function longitudeInValidRange(lon) {
    return (lon > MIN_LONGITUDE && lon <= MAX_LONGITUDE);
}


// Issues
// The following issues can be used to record validation warnings or errors.
// Later, the collection of issues can be output at once.


function CustomIssue(message) {

    this.message = message;

    this.toString = function() {
        return this.message;
    };
}

function ObsoleteIssue(attributeName) {

    this.attributeName = attributeName;

    this.toString = function() {
        return "Attribute '" + this.attributeName + "' is no longer used and can be removed.";
    };
}

function UndefinedAttributeIssue(attributeName) {

    this.attributeName = attributeName;

    this.toString = function() {
        return "Attribute '" + this.attributeName + "' cannot be undefined.";
    };
}


function NullAttributeIssue(attributeName) {

    this.attributeName = attributeName;

    this.toString = function() {
        return "Attribute '" + this.attributeName + "' cannot be null.";
    };
}

function EmptyAttributeIssue(attributeName) {

    this.attributeName = attributeName;

    this.toString = function() {
        return "Attribute '" + this.attributeName + "' cannot be empty.";
    };
}

function EmptyObjectIssue(attributeName) {

    this.attributeName = attributeName;

    this.toString = function() {
        return "Attribute '" + this.attributeName + "' cannot be an empty object.";
    };
}

function LatitudeRangeExceedanceIssue(attributeName, actual) {
    return new RangeExceedanceIssue(attributeName, MIN_LATITUDE, MAX_LATITUDE, actual);
}

function LongitudeRangeExceedanceIssue(attributeName, actual) {
    return new RangeExceedanceIssue(attributeName, MIN_LONGITUDE, MAX_LONGITUDE, actual);
}

function RangeExceedanceIssue(attributeName, min, max, actual) {

    this.attributeName = attributeName;
    this.min = min;
    this.max = max;
    this.actual = actual;

    this.toString = function() {
        return "Attribute '" + this.attributeName + "' exceeds valid range of [" +
        this.min + ":" + this.max + "]. Actual value is " + this.actual + ".";
    };
}

function UnknownProtocolIssue(protocol) {

    this.protocol = protocol;

    this.toString = function() {
        return "Unknown protocol '" + this.protocol + "' in data source url.";
    };
}

function HttpResponseStatusIssue(cityName, statusCode) {

    this.cityName = cityName;
    this.statusCode = statusCode;

    this.toString = function() {
        return this.cityName + ": HTTP response status of data source url was: " + this.statusCode;
    };
}

function HttpRedirectStatusIssue(cityName, statusCode, location) {

    this.cityName = cityName;
    this.statusCode = statusCode;
    this.location = location;

    this.toString = function() {
        return this.cityName + ": HTTP response status of data source url was: " + this.statusCode + "\n     --> New location: " + this.location;
    };
}

function ExpiredCertificateIssue(cityName, error) {

    this.cityName = cityName;

    this.toString = function() {
        return this.cityName + ": Cerficate has expired for data source url.";
    };
}

function HttpRequestErrorIssue(cityName, error) {

    this.cityName = cityName;
    this.error = error;

    this.toString = function() {
        return this.cityName + ": Error while accessing data source url: " + error;
    };
}
