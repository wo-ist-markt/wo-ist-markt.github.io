#!/usr/bin/env node
"use strict";


var fs = require('fs');
var path = require("path");
var colors = require('colors');
var moment = require('moment');
var opening_hours = require('opening_hours');


var DIR_PATH = "./cities/";


colors.setTheme({
	section: 'blue',
	market: 'yellow',
	passed: 'green',
	warn: 'red'
});


fs.readdir(DIR_PATH, function (err, files) {
    if (err) {
        throw err;
    }

    files.map(function(file) {
        return path.join(DIR_PATH, file);
    }).filter(function(file) {
        return fs.statSync(file).isFile();
    }).forEach(function(file) {
        console.log("\n===> Validating %s ...".section, file);
        var marketValidator = new MarketValidator(file);
        marketValidator.validate();
        console.log("\n");
    });
});


function MarketValidator(file) {

	this.file = file;

	this.validate = function() {
		var data = fs.readFileSync(this.file, 'utf8');
		var json = JSON.parse(data);
		var features = json.features;
		var cityName = this.getCityName();
		var featuresValidator = new FeaturesValidator(features, cityName);
		featuresValidator.validate();
		featuresValidator.printSummary();
	};

	this.getCityName = function() {
		return path.basename(this.file, path.extname(this.file));
	};

}


function FeaturesValidator(features, cityName) {

	this.features = features;
	this.cityName = cityName;
	this.warningsCount = 0;

	this.validate = function() {
		for (var i = 0, length = features.length; i < length; ++i) {
			var feature = features[i];
			var featureValidator = new FeatureValidator(feature, this.cityName);
			featureValidator.validate();
			if (featureValidator.hasWarnings()) {
				featureValidator.printTitle();
				featureValidator.printWarnings();
				this.warningsCount += featureValidator.getWarningsCount();
			}
		}
	};

	this.printSummary = function() {
		if (this.warningsCount === 0) {
			this.printSuccess();
		} else {
			this.printFailure();
		}
	};

	this.printSuccess = function() {
		console.log("\nValidation PASSED without warnings or errors.".passed);
	};

	this.printFailure = function() {
		console.log("\nValidation done. %d warning(s) detected.".warn, this.warningsCount);
	};

}


function FeatureValidator(feature, cityName) {

	this.feature = feature;
	this.cityName = cityName;
	this.warnings = [];

	this.validate = function() {
		var properties = feature.properties;
		var openingHours = properties.opening_hours;
		var openingHoursUnclassified = properties.opening_hours_unclassified;
		if (openingHours !== null) {
			this.validateOpeningHours(openingHours);
			this.validateOpeningHoursUnclassifiedIsNull(openingHoursUnclassified);
		} else {
			this.validateOpeningHoursIsNull(openingHours);
			this.validateOpeningHoursUnclassifiedIsNotNull(openingHoursUnclassified);
		}
		this.validateTitle(properties.title);
		this.validateGeometry(feature.geometry);
		this.validateType(feature.type);
	};

	this.validateTitle = function(title) {
		if (title === null) {
			this.warnings.push("Field 'title' cannot be null.");
		}
		else if (title.length === 0) {
			this.warnings.push("Field 'title' cannot be empty.");
		}
	};

	this.validateLocation = function(location) {
		if (location === null) {
			this.warnings.push("Field 'location' cannot be null.");
		}
		else if (location.length === 0) {
			this.warnings.push("Field 'location' cannot be empty.");
		}
	};

	this.validateOpeningHours = function(openingHours) {
		var oh;
		try {
			oh = new opening_hours(openingHours);
			this.warnings.concat(oh.getWarnings());
		} catch (error) {
			this.warnings.push(error.toString());
		}
	};

	this.validateOpeningHoursIsNull = function(openingHours) {
		if (openingHours !== null) {
			this.warnings.push("Field 'opening_hours' must be null when 'opening_hours_unclassified' is used.");
		}
	};

	this.validateOpeningHoursUnclassifiedIsNull = function(openingHoursUnclassified) {
		if (openingHoursUnclassified === undefined) {
			return;
		}
		if (openingHoursUnclassified !== null) {
			this.warnings.push("Field 'opening_hours_unclassified' must be null when 'opening_hours' is used.");
		}
	};

	this.validateOpeningHoursUnclassifiedIsNotNull = function(openingHoursUnclassified) {
		if (openingHoursUnclassified === null) {
			this.warnings.push("Field 'opening_hours_unclassified' cannot be null when 'opening_hours' is null.");
		}
	};

	this.validateGeometry = function(geometry) {
		if (geometry === undefined) {
			this.warnings.push("Field 'geometry' cannot be undefined.");
		} else if (geometry === null) {
			this.warnings.push("Field 'geometry' cannot be null.");
		} else {
			this.validateCoordinates(geometry.coordinates);
			this.validateGeometryType(geometry.type);
		}
	};

	this.validateCoordinates = function(coordinates) {
		if (coordinates === undefined) {
			this.warnings.push("Field 'coordinates' cannot be undefined.");
		} else if (coordinates === null) {
			this.warnings.push("Field 'coordinates' cannot be null.");
		} else if (coordinates.length !== 2) {
			this.warnings.push("Field 'coordinates' must contain two values not " + coordinates.length + ".");
		}
	};

	this.validateGeometryType = function(type) {
		if (type !== "Point") {
			this.warnings.push("Field 'geometry.type' must be 'Point' not '" + type + "'.");
		}
	};

	this.validateType = function(type) {
		if (type !== "Feature") {
			this.warnings.push("Field 'type' must be 'Feature' not '" + type + "'.");
		}
	};

	this.getWarningsCount = function() {
		return this.warnings.length;
	};

	this.hasWarnings = function() {
		return this.warnings.length > 0;
	};

	this.printTitle = function() {
		console.log("\n%s: %s".market,
			this.cityName.toUpperCase(),
			this.feature.properties.title);
	};

	this.printWarnings = function() {
		for (var i = 0, length = this.warnings.length; i < length; ++i) {
			console.log(this.warnings[i]);
		}
	};

}
