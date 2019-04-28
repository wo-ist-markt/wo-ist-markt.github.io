#!/usr/bin/env node
"use strict";



var fs = require('fs');
var moment = require('moment');
var opening_hours = require('opening_hours');


var INPUT_FILE = "./preprocessing/berlin/raw/markets-berlin.json";
var OUTPUT_FILE = "./cities/berlin.json";


fs.readFile(INPUT_FILE, 'utf8', function (error, data) {
	if (error) {
		throw error;
	}
	var featureCollection = JSON.parse(data);
	var outputData = featureCollection;
	var features = featureCollection.features;

	for (var i = 0, length = features.length; i < length; ++i) {
		var feature = features[i];
		var outputFeature = outputData.features[i];
		var outputProperties = prepareFeatureProperties(feature);
		// console.log(outputProperties.opening_hours);
		// console.log(outputProperties.opening_hours_unclassified);
		outputFeature.properties = outputProperties;
		outputFeature.geometry.coordinates = getWellFormedCoordinates(feature);
	}
	var outputDataString = JSON.stringify(outputData, null, 4);
	writeFile(outputDataString);
});

/*
 * Writes data to a file;
 */
function writeFile(data) {
	fs.writeFile(OUTPUT_FILE, data, function(error) {
		if (error) {
			throw error;
		}
		console.log("File " + OUTPUT_FILE + " has been written.");
	});
}

/*
 * Returns coordinates in the correct order according to the GeoJSON specification.
 */
function getWellFormedCoordinates(feature) {
	var coordinates = feature.geometry.coordinates;
	return [coordinates[0], coordinates[1]];
}

/*
 * Returns the properties object filled with attributes.
 */
function prepareFeatureProperties(feature) {
	var outputProperties = {};
	var inputProperties = feature.properties.data;
	var location = inputProperties.location;
	var title = getDescriptiveTitle(feature.properties.title, location);
	var sanitizedTitle = getSanitizeString(title);
	var sanitizedLocation = getSanitizeString(location);
	outputProperties.title = sanitizedTitle;
	outputProperties.location = sanitizedLocation;
	var days = inputProperties.tage;
	var hours = inputProperties.zeiten;
	var sanitizedDays = getSanitizeDays(days);
	var sanitizedHours = getSanitizeHours(hours);
	var days_hours = sanitizedDays + " " + sanitizedHours;

	try {
		getOpeningRanges(days_hours);
		var opening_hours = composeOpeningHours(sanitizedDays, sanitizedHours);
		outputProperties.opening_hours = opening_hours;
		outputProperties.opening_hours_unclassified = null;
	}
	catch(error) {
		outputProperties.opening_hours = null;
		var daysHours = (getSanitizeString(days) + " " + getSanitizeString(hours)).trim();
		if (daysHours.length === 0) {
			daysHours = inputProperties.bemerkungen;
		}
		outputProperties.opening_hours_unclassified = daysHours;
	}
	return outputProperties;
}

/*
 * Returns a descriptive title.
 */
function getDescriptiveTitle(title, alternativeTitle) {
	var tempTitle = title;
	if (tempTitle === "Mehrerer Einträge..." || tempTitle === "Mehrere Einträge...") {
		tempTitle = alternativeTitle;
	}
	return tempTitle;
}

/*
 * Returns an opening hours string which can be processed via opening_hours.js
 * or null if either the days or the hours string contain information which
 * cannot be transformed into valid opening hours.
 */
function composeOpeningHours(days, hours) {
	var dayHours = [];
	var dayArray = days.split(",");
	// Skip processing if other then weekday abbreviations are found
	var dayArrayLength = dayArray.length;
	for (var i = 0; i < dayArrayLength; ++i) {
		var day = dayArray[i].trim();
		// Heuristic: Expected day formats: "Mo" or "Mo-We"
		if (!(day.length === 2 || day.length === 5)) {
			throw "Day can most likely not be processed automatically.";
		}
	}
	var hoursArray = hours.split(",");
	// Transform "Mo Sa 13:00-18:00 11:00-16:00"
	// into "Mo 13:00-18:00; Sa 11:00-16:00"
	if (dayArray.length === hoursArray.length) {
		for (var j = 0; j < dayArrayLength; ++j) {
			dayHours.push(dayArray[j] + " " + hoursArray[j]);
		}
		return dayHours.join(";");
	}
	// "Mo 13:00-18:00 11:00-16:00" is a valid combination
	else if (dayArray.length === 1 && hoursArray.length > 1) {
		return days + " " + hours;
	}
	// "Mo Sa 13:00-18:00" is a valid combination
	else if (dayArray.length > 1 && hoursArray.length === 1) {
		return days + " " + hours;
	}
	throw "Day can most likely not be processed automatically.";
}

/*
 * Returns a sanitized string.
 */
function getSanitizeString(hours) {
	hours = hours.replace(/  /g, " ");
	hours = hours.replace(/\n/g, " ");
	hours = hours.replace(/„/g, "");
	hours = hours.replace(/“/g, " ");
	hours = hours.replace(/Â/g, " ");
	hours = hours.trim();
	return hours;
}

/*
 * Returns a sanitized days string.
 */
function getSanitizeDays(days) {
	days = days.replace("Di", "Tu");
	days = days.replace("Mi", "We");
	days = days.replace("Do", "Th");
	days = days.replace("So", "Su");
	days = days.replace(/sonntags/g, "Su");
	days = days.replace(/\n\n\n/g, ",");
	days = days.replace(/, \n/g, ",");
	days = days.replace(/\n/g, ",");
	days = days.replace("\n", ",");
	days = days.replace(/ - /g, "-");
	days = days.replace(/, ,/g, ",");
	days = days.replace(/, /g, ",");
	days = days.replace(/ /g, "");
	days = days.trim();
	return days;
}

/*
 * Returns a sanitized hours string.
 */
function getSanitizeHours(hours) {
	hours = hours.replace(/ - /g, "-");
	hours = hours.replace(/\n\n\n/g, " ");
	hours = hours.replace(/\n\n/g, " ");
	hours = hours.replace(/\n/g, " ");
	hours = hours.replace(/ /g, ",");
	hours = hours.replace(/^,/g, "");
	hours = hours.trim();
	return hours;
}

/*
 * Returns opening ranges compiled via opening_hours.js.
 */
function getOpeningRanges(opening_hours_strings) {
    var monday = moment().startOf("week").add(1, 'days').toDate();
    var sunday = moment().endOf("week").add(1, 'days').toDate();
    var oh = new opening_hours(opening_hours_strings);
    return oh.getOpenIntervals(monday, sunday);
}
