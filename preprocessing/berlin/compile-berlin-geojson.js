#!/usr/bin/env node
"use strict";


import fs from 'fs';
import dayjs from 'dayjs';
import opening_hours from 'opening_hours';


var INPUT_FILE = "./preprocessing/berlin/raw/markets-berlin.json";
var OUTPUT_FILE = "./cities/berlin.json";

sortInputFileByTitle();

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

	outputData.features = distinctFeatures(outputData.features);

	var outputDataString = JSON.stringify(outputData, null, 4);
	writeFile(OUTPUT_FILE, outputDataString);
});

function distinctFeatures(features) {
	let distinctFeatures = [];
	for (let feature of features) {
		fillDistinctFeatures(distinctFeatures, feature);
	}
	return distinctFeatures;
}

function fillDistinctFeatures(distinctFeatures, feature) {
	let filterResult = distinctFeatures.filter(item => areFeaturesEqual(item, feature));
	if (filterResult.length == 0) {
		distinctFeatures.push(feature);
	}
}

function areFeaturesEqual(feature1, feature2) {
	return feature1.type == feature2.type &&
	feature1.geometry.type == feature2.geometry.type &&
	feature1.geometry.coordinates[0] == feature2.geometry.coordinates[0] &&
	feature1.geometry.coordinates[1] == feature2.geometry.coordinates[1] &&
	feature1.properties.title == feature2.properties.title &&
	// Skip "location" property because spelling differs there.
	feature1.properties.opening_hours == feature2.properties.opening_hours &&
	feature1.properties.opening_hours_unclassified == feature2.properties.opening_hours_unclassified &&
	feature1.properties.details_url == feature2.properties.details_url;
}


function sortInputFileByTitle() {
	fs.readFile(INPUT_FILE, 'utf8', function (error, data) {
		if (error) {
			throw error;
		}
		var featureCollection = JSON.parse(data);
		var outputData = featureCollection;

		outputData.features = outputData.features.sort(function(a, b) {
			if (a.properties.title > b.properties.title) {
				return 1;
			}
			if (a.properties.title < b.properties.title) {
				return -1;
			}
			return a.properties.id > b.properties.id ? 1 : -1;
		});

		var outputDataString = JSON.stringify(outputData, null, 4);
		writeFile(INPUT_FILE, outputDataString);
	});
}

/*
 * Writes data to a file;
 */
function writeFile(FILE, data) {
	fs.writeFile(FILE, data, function(error) {
		if (error) {
			throw error;
		}
		console.log("File " + FILE + " has been written.");
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
	var zipCode = inputProperties.plz;
	var streetNameAndNumber = inputProperties.strasse;
	var detailsUrl = inputProperties.www;
	var sanitizedZipCode = getSanitizeString(zipCode);
	var sanitizedStreetNameAndNumber = getSanitizeString(streetNameAndNumber);
	var sanitizedLocation = getLocationText(sanitizedStreetNameAndNumber, sanitizedZipCode);
	var sanitizedDetailsUrl = getSanitizedUrl(detailsUrl);
	var title = getDescriptiveTitle(feature.properties.title, sanitizedLocation);
	var sanitizedTitle = getSanitizeString(title);
	outputProperties.title = sanitizedTitle;
	outputProperties.location = sanitizedLocation;
	var days = inputProperties.tage;
	var dayRanges = inputProperties.zeitraum;
	var hours = inputProperties.zeiten;
	var sanitizedDays = getSanitizeDays(days);
	var sanitizedHours = getSanitizeHours(hours);
	var days_hours = sanitizedDays + " " + sanitizedHours;

	try {
		parseWithOpeningHoursJs(days_hours);
		var opening_hours = composeOpeningHours(sanitizedDays, sanitizedHours);
		outputProperties.opening_hours = opening_hours;
		outputProperties.opening_hours_unclassified = null;
	}
	catch(error) {
		outputProperties.opening_hours = null;
		var daysHours = "";
		if (getSanitizeString(days).length > 0 && getSanitizeString(days) !== "/") {
			daysHours += getSanitizeString(days);
		}
		if (getSanitizeString(hours).length > 0) {
			if (daysHours.length > 0) {
				daysHours += " ";
			}
			daysHours += getSanitizeString(hours);
		}
		if (getSanitizeString(dayRanges).length > 0 && getSanitizeString(dayRanges) !== "/") {
			daysHours = daysHours + " / " + getSanitizeString(dayRanges);
		}
		if (daysHours.length === 0) {
			daysHours = inputProperties.bemerkungen;
		}
		outputProperties.opening_hours_unclassified = daysHours;
	}

	if (sanitizedDetailsUrl) {
		outputProperties.details_url = sanitizedDetailsUrl;
	}
	return outputProperties;
}

/*
 * Returns a location text composed from given input parameters or an empty string.
 * Examples, valid results:
 * - "Breitenbachplatz 1, 14195"
 * - "Breitenbachplatz 1"
 * - "14195"
 * - ""
 */
function getLocationText(streetNameAndNumber, zipCode) {
	return [streetNameAndNumber, zipCode].filter(text => text && text.length).join(", ");
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
 * Returns a sanitized HTTP(S) URL or an empty string.
 * HTTP is used here because not all websites serve via HTTPS.
 */
function getSanitizedUrl(url) {
	url = getSanitizeString(url);
	if (!url) {
		return url;
	}
	if (!url.startsWith("http://") && !url.startsWith("https://")) {
		url = "http://" + url;
	}
	return url;
}

/*
 * Returns a sanitized string.
 */
function getSanitizeString(text) {
	text = text.replace(/  /g, " ");
	text = text.replace(/\n+/g, " ");
	text = text.replace(/„/g, "");
	text = text.replace(/“/g, " ");
	text = text.replace(/Â/g, " ");
	text = text.replace(/\s+/g, " ");
	text = text.trim();
	return text;
}

const ENGLISH_MONTH_ABBREVATION_BY_GERMAN_MONTHS_NAME = {
	"Januar": "Jan",
	"Februar": "Feb",
	"März": "Mar",
	"April": "Apr",
	"Mai": "May",
	"Juni": "Jun",
	"Juli": "Jul",
	"August": "Aug",
	"September": "Sep",
	"Oktober": "Oct",
	"November": "Nov",
	"Dezember": "Dec"
};

/*
 * Returns a sanitized days string.
 */
function getSanitizeDays(days) {
	Object.entries(ENGLISH_MONTH_ABBREVATION_BY_GERMAN_MONTHS_NAME)
	      .forEach(([key, value]) => { days = days.replaceAll(key, value); });
	days = days.replace(/gesetzliche Feiertage/g, "PH");
	days = days.replace("Di", "Tu");
	days = days.replace("Mi", "We");
	days = days.replace("Do", "Th");
	days = days.replace("So", "Su");
	days = days.replace(/sonntags/g, "Su");
	days = days.replace(" und ", ", ");
	days = days.replace(/\n\n\n/g, ",");
	days = days.replace(/, \n/g, ",");
	days = days.replace(/\n/g, ",");
	days = days.replace("\n", ",");
	days = days.replace(/ - /g, "-");
	days = days.replace(/, ,/g, ",");
	days = days.replace(/, /g, ",");
	days = days.replace("/", "");
	days = days.replace(/ /g, "");
	days = days.replace(/\s+/g, "");
	days = days.trim();
	return days;
}

/*
 * Returns a sanitized hours string.
 */
function getSanitizeHours(hours) {
	hours = hours.replace(/ab (\d\d:\d\d)/g, "$1+");
	hours = hours.replace(/Uhr/g, "");
	hours = hours.replace(/uhr/g, "");
	hours = hours.replace(/ bis /g, "-");
	hours = hours.replace(/ - /g, "-");
	hours = hours.replace(/\n+/g, " ");
	hours = hours.replace(/\n\s+/g, " ");
	hours = hours.replace(/\s+/g, " ");
	hours = hours.replace(/ /g, ",");
	hours = hours.replace(/^,/g, "");
	hours = hours.replace(/,$/g, "");
	hours = hours.trim();
	return hours;
}

/*
 * Parses the given string with the opening_hours.js library.
 * An error is thrown if the parsing fails.
 */
function parseWithOpeningHoursJs(opening_hours_strings) {
    var monday = dayjs().startOf("week").add(1, 'day').toDate();
    var sunday = dayjs().endOf("week").add(1, 'day').toDate();
    var options = {
    	"address" : {
    		"country_code" : "de"
    	}
    };
    var oh = new opening_hours(opening_hours_strings, options);
    oh.getOpenIntervals(monday, sunday);
}
