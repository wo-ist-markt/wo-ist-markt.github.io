#!/usr/bin/env node
/*
 * This script loads the cities from cities.json;
 * For each city that has no `coordinates` property, it tries to get the coordinates from Wikipedia;
 * If the city or the coordinates are not found, an error is shown.
 * If that happens please add the coordinates manually to the cities.json file.
 */

import fs from 'fs';
import axios from 'axios';
import ora from 'ora';

var CITY_FILE = 'cities/cities.json';
var WIKIPEDIA_API_URL = "https://en.wikipedia.org/w/api.php"; 

async function getCoordinatesForCity(cityName) {
	var response = await axios.get(WIKIPEDIA_API_URL, { 
		params: {
			titles: cityName,
			origin: "*",
			action: "query",
			prop: "coordinates",
			format: "json"
		}
	});
	var pages = response && response.data && response.data.query && 
		response.data.query.pages ? Object.values(response.data.query.pages) : null;
	if (!pages) {
		throw new Error("No pages found");
	} else if (pages.length > 1) {
		throw new Error("More than one entry found");
	}

	const coordinates = pages[0].coordinates;
	if (!coordinates || !coordinates.length) {
		throw new Error("No coordinates found");
	}
	return [coordinates[0].lat, coordinates[0].lon];
}

async function main() {
	var cities = JSON.parse(fs.readFileSync(CITY_FILE));
	for (var city of Object.values(cities)) {
		var name = city.label;
		var spinner = ora(`Processing "${name}"`).start();

		if (city && city.coordinates) {
			spinner.info(`City "${name}" already has coordinates: [${city.coordinates[0].toFixed(1)}, ${city.coordinates[1].toFixed(1)}]`);
			continue;
		}

		try {
			const cityCoordinates = await getCoordinatesForCity(name);
			spinner.succeed(`Found coordinates of city "${name}" in Wikipedia: ${cityCoordinates}`);
			cities[city.id].coordinates = cityCoordinates;
		} catch(err) {
			spinner.fail(`Could not get coordinates for city "${name}" from Wikipedia: ${err}`);
			continue;
		}
	}
	fs.writeFileSync(CITY_FILE, JSON.stringify(cities, null, 4));
}
main();
