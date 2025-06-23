/*
 * © Code for Karlsruhe and contributors.
 * See the file LICENSE for details.
 */

// import for bundle.css
require('../css/main.css');
require('../node_modules/normalize.css/normalize.css');
require('../node_modules/select2/dist/css/select2.min.css');
require('../node_modules/leaflet/dist/leaflet.css');
require('../node_modules/leaflet.locatecontrol/dist/L.Control.Locate.css');
require('../node_modules/leaflet.awesome-markers/dist/leaflet.awesome-markers.css');
require('../font/wo-ist-markt.css');

const $ = require('jquery');
require('select2')($);

const dayjs = require('dayjs');
const isBetween = require('dayjs/plugin/isBetween');
const isoWeek = require('dayjs/plugin/isoWeek');

require('leaflet');
require('leaflet.awesome-markers');

const { LocateControl } = require("leaflet.locatecontrol");

const opening_hours = require('opening_hours');
require('i18next-client');

var TILES_URL = '//cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png';
var ATTRIBUTION = '<a id="daten" href="info.html">Über Wo ist Markt?</a> | ' +
                  '<a id="impressum" href="impressum-datenschutz.html">Impressum &amp; Datenschutz</a> | ' +
                  '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> | ' +
                  'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> | ' +
                  'contributors <a href="http://creativecommons.org/licenses/by-sa/2.0/">' +
                  'CC-BY-SA</a> | Tiles &copy; <a href="http://cartodb.com/attributions">' +
                  'CartoDB</a>';

var DEFAULT_CITY_ID = "karlsruhe";
var CITY_LIST_API_URL = 'cities/cities.json';
var cityDirectory = {}; // the city directory (i.e. a list of all cities indexed by id)

var map;
var nowGroup = L.featureGroup();
var todayGroup = L.featureGroup();
var otherGroup = L.featureGroup();
var unclassifiedGroup = L.featureGroup();

var now = new Date();
var TIME_NOW = [now.getHours(), now.getMinutes()];
var DAY_INDEX = (now.getDay() + 6) % 7;  // In our data, first day is Monday
var DAY_NAMES = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
var DEFAULT_MARKET_TITLE = 'Markt';

L.AwesomeMarkers.Icon.prototype.options.prefix = 'icon';
var nowIcon = L.AwesomeMarkers.icon({markerColor: 'green', icon: 'basket'});
var todayIcon = L.AwesomeMarkers.icon({markerColor: 'darkgreen', icon: 'basket'});
var otherIcon = L.AwesomeMarkers.icon({markerColor: 'cadetblue', icon: 'basket'});
var unclassifiedIcon = L.AwesomeMarkers.icon({markerColor: 'darkpurple', icon: 'basket'});

dayjs.extend(isBetween);
dayjs.extend(isoWeek);

/*
 * Return 0-padded string of a number.
 */
function pad(num, totalDigits) {
    var s = num.toString();
    while (s.length < totalDigits) {
        s = '0' + s;
    }
    return s;
}

/**
 * Returns the HTML for time-table row(s).
 * Each time this reduce function is invoked the former rows HTML is passed in.
 */
function getTimeTableRowsHtml(rowsHtml, openingRange) {
    var dayIsToday = openingRangeMatchesDay(openingRange, now);
    return rowsHtml += getTableRowForDay(openingRange, dayIsToday);
}

/*
 * Creates time-table HTML code.
 *
 * `openingRanges` is a list of ranges compiled via opening_hours.js.
 * The first and second element of each range item are the starting and closing dates.
 */
function getTimeTableHtml(openingRanges) {
    var html = '<table class="times">';
    if (openingRanges !== undefined) {
        html += openingRanges.reduce(getTimeTableRowsHtml, "");
    }
    html += '</table>';
    return html;
}

/*
 * Returns table row for a day with opening hours.
 * If the day matches today the row is styled.
 */
function getTableRowForDay(openingRange, dayIsToday) {
    var openFromDate = openingRange[0];
    var openTillDate = openingRange[1];
    var dayNameIndex = openFromDate.getDay();
    var dayName = DAY_NAMES[dayNameIndex];
    var cls = dayIsToday ? ' class="today"' : '';
    var formattedOpenFrom = dayjs(openFromDate).format('HH:mm');
    var formattedOpenTill = dayjs(openTillDate).format('HH:mm');
    return '<tr' + cls + '><th>' + dayName + '</th>' +
           '<td>' + formattedOpenFrom + ' - ' + formattedOpenTill + ' Uhr</td></tr>';
}

/*
 * Format HTML for next market date
 */
function getNextMarketDateHtml(nextChange) {
    var html = '<p class="times">Nächster Termin: ' +
        dayjs(nextChange).format('DD. MMM') + ' ab ' +
        dayjs(nextChange).format('HH:mm') + ' Uhr.</p>';
    return html;
}

/*
 * Moves the map to its initial position.
 */
function positionMap() {
    var bounds = L.featureGroup([nowGroup, todayGroup, otherGroup, unclassifiedGroup]).getBounds();
    map.fitBounds(bounds);
}

/*
 * Gets a city object by ID
 */
function getCity(cityId) {
    return cityDirectory[cityId];
}

/*
 * Update layer controls.
 *
 * Controls which serve no purpose are disabled. For example, if
 * currently no markets are open then the corresponding radio
 * button is disabled. The most specific, active choice is selected.
 */
function updateControls() {
    var gotNow = nowGroup.getLayers().length > 0;
    var gotToday = todayGroup.getLayers().length > 0;
    $('#now').prop('disabled', !gotNow);
    $('#now').prop('checked', gotNow);
    $('#today').prop('disabled', !gotToday);
    $('#today').prop('checked', !gotNow && gotToday);
    $('#other').prop('checked', !gotNow && !gotToday);
}


/*
 * Update layer visibility according to layer control settings.
 */
function updateLayers() {
    var value = document.querySelector('[name="display"]:checked').value;
    map.removeLayer(nowGroup);
    map.removeLayer(todayGroup);
    map.removeLayer(otherGroup);
    map.removeLayer(unclassifiedGroup);
    map.addLayer(nowGroup);
    map.addLayer(unclassifiedGroup);
    switch (value) {
        case "today":
            map.addLayer(todayGroup);
            break;
        case "other":
            map.addLayer(todayGroup);
            map.addLayer(otherGroup);
            break;
    }
}

/*
 * Returns true if opening range matches the day of the given date; otherwise false.
 */
function openingRangeMatchesDay(openingRange, date) {
    var openFromDate = openingRange[0];
    var openTillDate = openingRange[1];
    var dayIndex = date.getDay();
    return openFromDate.getDay() === dayIndex && openTillDate.getDay() === dayIndex;
}

/*
 * Returns true if opening range contains the time of the given date; otherwise false.
 */
function openingRangeContainsTime(openingRange, date) {
    return dayjs(date).isBetween(openingRange[0], openingRange[1]);
}

/*
 * Returns opening times compiled via opening_hours.js.
 * Returns a object with the next opening date or opening ranges if available.
 * Returns null if no next opening date or ranges are available.
 */
function getOpeningTimes(openingHoursStrings) {
    var monday = dayjs().startOf("isoweek").toDate();
    var sunday = dayjs().endOf("isoweek").toDate();
    var options = {
        "address" : {
            "country_code" : "de"
        }
    };
    var oh = new opening_hours(openingHoursStrings, options);
    var intervals = oh.getOpenIntervals(monday, sunday);
    var nextChange = oh.getNextChange();

    if (intervals.length > 0) {
        /* Return opening ranges */
        return {
            intervals: intervals
        };
    } else if (typeof nextChange !== 'undefined') {
        /* Return next opening date */
        return {
            nextChange: nextChange
        };
    } else {
        return null;
    }
}

/*
 * Returns opening range for date or undefined.
 */
function getOpeningRangeForDate(openingRanges, date) {
    if (openingRanges !== undefined) {
        return openingRanges.find(function(openingRange) {
            return openingRangeMatchesDay(openingRange, date);
        });
    }
    return undefined;
}

/*
 * Update map markers from JSON market data.
 */
function updateMarkers(featureCollection) {
    nowGroup.clearLayers();
    todayGroup.clearLayers();
    otherGroup.clearLayers();
    unclassifiedGroup.clearLayers();
    L.geoJson(featureCollection, {
        onEachFeature: initMarker
    });
}

function initMarker(feature) {
    var properties = feature.properties;
    var openingHoursStrings = properties.opening_hours;
    if (openingHoursStrings === undefined) {
        throw "Missing property 'opening_hours' for " + properties.title + " (" + properties.location + ").";
    }
    var todayOpeningRange;
    var timeTableHtml;
    var openingHoursUnclassified;
    if (openingHoursStrings === null || openingHoursStrings.length === 0) {
        openingHoursUnclassified = properties.opening_hours_unclassified;
    } else {
        var openingTimes = getOpeningTimes(openingHoursStrings);
        /* If no opening hours or a next date, don't show a marker. */
        if (openingTimes === null) {
            return;
        }
        /* Are there opening hours in the current week? */
        else if (openingTimes.hasOwnProperty('intervals')) {
            todayOpeningRange = getOpeningRangeForDate(openingTimes.intervals, now);
            timeTableHtml = getTimeTableHtml(openingTimes.intervals);
        }
        /* Is there a next market date? */
        else if (openingTimes.hasOwnProperty('nextChange')) {
            timeTableHtml = getNextMarketDateHtml(openingTimes.nextChange);
        }
    }

    var coordinates = feature.geometry.coordinates;
    var marker = L.marker(L.latLng(coordinates[1], coordinates[0]));
    var where = properties.location;
    if (where === undefined) {
        throw "Missing property 'location' for " + properties.title + ".";
    }
    if (where !== null) {
        where = '<p>' + where + '</p>';
    } else {
        where = '';
    }

    var additionalInformationLink = properties.details_url ?
        '<span><a href='+properties.details_url+'> weitere Informationen </a></span>' : '';

    var title = properties.title;
    if (title === undefined) {
        throw "Missing property 'title'.";
    }
    if (title === null || title.length === 0) {
        title = DEFAULT_MARKET_TITLE;
    }
    var popupHtml = '<h1>' + title + '</h1>' + where + additionalInformationLink;
    if (openingHoursUnclassified !== undefined) {
        popupHtml += '<p class="unclassified">' + openingHoursUnclassified + '</p>';
    } else {
        popupHtml += timeTableHtml;
    }
    marker.bindPopup(popupHtml);
    if (todayOpeningRange !== undefined) {
        marker.setIcon(todayIcon);
        todayGroup.addLayer(marker);

        if (openingRangeContainsTime(todayOpeningRange, now)) {
            marker.setIcon(nowIcon);
            nowGroup.addLayer(marker);
        }
    } else {
        if (openingHoursUnclassified !== undefined) {
            marker.setIcon(unclassifiedIcon);
            unclassifiedGroup.addLayer(marker);
        } else {
            marker.setIcon(otherIcon);
            otherGroup.addLayer(marker);
        }
    }
}


/*
 * Returns the city ID from the hash of the current URI.
 */
function getHashCity() {
    var hash = decodeURIComponent(window.location.hash);
    if (hash === undefined || hash === "") {
        return '';
    } else {
        hash = hash.toLowerCase();
        return hash.substring(1, hash.length);
    }
}


/*
 * Updates the URL hash in the browser.
 *
 * `cityID` is the new city's ID. If `createNewHistoryEntry` is true then a new
 * entry in the browser's history is created for the change. Otherwise the
 * current history entry is replaced.
 */
function updateUrlHash(cityID, createNewHistoryEntry) {
    if (createNewHistoryEntry) {
        createHistoryEntryWithHash(cityID);
    } else {
        replaceHistoryEntryWithHash(cityID);
    }
}


/*
 * Create a new history entry by changing the URL fragment.
 *
 * `hash` is the new fragment (without `#`).
 */
function createHistoryEntryWithHash(hash) {
    if (history.pushState) {
        history.pushState(null, null, "#" + hash);
    } else {
        window.location.hash = hash;
    }
}


/*
 * Replace the current history entry by changing the URL fragment.
 *
 * `hash` is the new fragment (without `#`).
 */
function replaceHistoryEntryWithHash(hash) {
    hash = '#' + hash;
    if (history.replaceState) {
        history.replaceState(null, null, hash);
    } else {
        // http://stackoverflow.com/a/6945614/857390
        window.location.replace(('' + window.location).split('#')[0] + hash);
    }
}


/*
 * Returns the given string in camel case.
 */
function toCamelCase(str) {
    return str.replace(/(?:^|\s)\w/g, function(match) {
        return match.toUpperCase();
    });
}

/*
 * Updates the legend data source.
 */
function updateDataSource(cityName, dataSource) {
    var title = dataSource.title;
    var url = dataSource.url;
    $("#dataSource").html('<a href="' + url + '">' + title + '</a>');
    $("#cityName").text(cityName);
}

/*
 * Loads the default city.
 *
 * If `createNewHistoryEntry` is true then a new
 * entry in the browser's history is created for the change. Otherwise the
 * current history entry is replaced.
 */
function loadDefaultCity(createNewHistoryEntry) {
    setCity(DEFAULT_CITY_ID, createNewHistoryEntry);
}

/*
 * Set the current city.
 *
 * `cityID` is the new city's ID. If `createNewHistoryEntry` is true then a new
 * entry in the browser's history is created for the change. Otherwise the
 * current history entry is replaced.
 */
function setCity(cityID, createNewHistoryEntry) {
    cityID = cityID || DEFAULT_CITY_ID;
    cityID = sanitizeCityID(cityID);

    var filename = 'cities/' + cityID + '.json';
    if (filename === CITY_LIST_API_URL) {
        return loadDefaultCity(false);
    }
    $.getJSON(filename, function(json) {
        var cityName = getCity(cityID).label;
        updateDataSource(cityName, json.metadata.data_source);
        updateMarkers(json);
        positionMap();
        updateControls();
        updateLayers();
        updateUrlHash(cityID, createNewHistoryEntry);
        document.title = 'Wo ist Markt in ' + cityName + '?';

        // Update drop down but avoid recursion
        $('#dropDownCitySelection').val(cityID).trigger('change', true);
    }).fail(function() {
        console.log('Failure loading "' + filename + '".');
        if (cityID !== DEFAULT_CITY_ID) {
            console.log('Loading default city "' + DEFAULT_CITY_ID +
                        '" instead.');
            loadDefaultCity(createNewHistoryEntry);
        }
    });
}

/*
 * Checks the cityID for unexpected characters or if it is too long.
 *
 * In case the cityID is invalid, it emits a console.error message.
 *
 * Returns the cityID if the cityID is valid, otherwise the DEFAULT_CITY_ID.
 */
function sanitizeCityID(cityID) {
  // the regexp also contains German Umlaute äöü
  // from here https://stackoverflow.com/a/22017800 by
  // IProblemFactory (https://stackoverflow.com/users/140070/iproblemfactory)
  var validCityRegexp = '^[\-a-z0-9_\u00e4\u00f6\u00fc]{1,40}$';
  var regexp = new RegExp(validCityRegexp, 'i');
  if (!regexp.test(cityID)) {
    console.error('Invalid cityID "' + cityID + '". Loading  "' +
                  DEFAULT_CITY_ID + '" instead.');
    return DEFAULT_CITY_ID;
  }
  return cityID;
}

/*
 * Load the IDs of the available cities.
 *
 * Returns a jQuery `Deferred` object that resolves to an array of city objects.
 */
function loadCities() {
    "use strict";
    var d = $.Deferred();
    $.get(CITY_LIST_API_URL, function(result) {
        var resultLength = result.length,
            resultMalformed = false;
        $.each(result, function(key, value) {
            if (value.id === undefined || value.label === undefined) {
                resultMalformed = true;
            }
        });
        if (resultMalformed) {
            d.reject();
        } else {
            d.resolve(result);
        }
    }).fail(function(e) {
        console.log("Loading " + CITY_LIST_API_URL + " failed.");
        d.reject(e);
    });
    return d;
}


/*
 * Collapse the header so that it only shows the most important information.
 */
function collapseHeader() {
    $('#details').slideUp({progress: fixMapHeight});
}

/*
 * Expand the header so that it shows all information.
 */
function expandHeader() {
    $('#details').slideDown({progress: fixMapHeight});
}


/*
 * Toggle collapsed/expanded header state.
 */
function toggleHeader() {
    if ($('#details').is(':visible')) {
        collapseHeader();
    } else {
        expandHeader();
    }
}


/*
 * Fix the height of #map so that it covers the whole viewport minus the
 * header.
 */
function fixMapHeight() {
    $('#map').outerHeight($(window).height() - $('#header').outerHeight(true));
}

/* Calculate the distance between two points in km
 * CC-BY by https://stackoverflow.com/users/635195/derek
 * https://stackoverflow.com/a/18883819/722162
 */
function calcDistance(lat1, lon1, lat2, lon2) {
    // Converts numeric degrees to radians
    const toRad = (v) => v * Math.PI / 180;
    var R = 6371; // km
    var dLat = toRad(lat2-lat1);
    var dLon = toRad(lon2-lon1);
    var rlat1 = toRad(lat1);
    var rlat2 = toRad(lat2);
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(rlat1) * Math.cos(rlat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d;
}

/* Ask the user for it's position;
 * If no position is available show the default city;
 * If a position is available search for the nearest city and show it;
 * If the nearest city is out of rand (maxDistanceInKm) show the default city as a fallback;
 */
function showNearestCity(cities, fallBackToDefault = true, maxDistanceInKm = 50) {
    try {
        if (!navigator.geolocation) {
            throw new Error("Geolocation is not supported by this browser.");
        }
        navigator.geolocation.getCurrentPosition(
            (userPosition) => {
                const cityDistances = Object.values(cities)
                    .map((city) => {
                        const cityPosition = city.coordinates;
                        // add a new distance-field to the city object
                        city.distanceToUser = cityPosition ? calcDistance(
                            userPosition.coords.latitude, userPosition.coords.longitude,
                            cityPosition[0], cityPosition[1]
                        ) : null;
                        return city;
                    })
                    .filter(city => city.distanceToUser)
                    .sort((a, b) => {
                        return a.distanceToUser && b.distanceToUser ? a.distanceToUser - b.distanceToUser : null;
                    });
                const nearestCity = cityDistances[0];
                if (nearestCity && nearestCity.distanceToUser && nearestCity.distanceToUser <= maxDistanceInKm) {
                    setCity(nearestCity.id, true);
                } else {
                    console.warn("No city found within " + maxDistanceInKm + "km.");
                    if (fallBackToDefault) loadDefaultCity();
                }
            },
            (error) => {
                try {
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            throw new Error("Benutzer lehnte Standortabfrage ab.");
                        case error.POSITION_UNAVAILABLE:
                            throw new Error("Standortdaten sind nicht verfügbar.");
                        case error.TIMEOUT:
                            throw new Error("Die Standortabfrage dauerte zu lange (Time-out).");
                        case error.UNKNOWN_ERROR:
                        default:
                            throw error;
                    }
                } catch (err) {
                    console.error(`[showNearestCity] ${err}`);
                    if (fallBackToDefault) loadDefaultCity();
                }
            }
        );
    } catch (err) {
        console.error(`[showNearestCity] ${err}`);
        if (fallBackToDefault) loadDefaultCity();
    }
}

$(window).on('resize', fixMapHeight);


$(window).on('hashchange',function() {
    // Don't create a new history state, because the hash change already did
    setCity(getHashCity(), false);
});


$(document).ready(function() {
    // Set `tap` to `false` to work around an issue in leaflet 1.7.1
    // that prevents marker popups from opening in Safari.
    // See this Github issue for details:
    // https://github.com/Leaflet/Leaflet/issues/7255
    map = new L.map('map', { attributionControl: false, tap: false });
    L.control.attribution( { prefix: '' } ).addTo(map);
    L.tileLayer(TILES_URL, { attribution: ATTRIBUTION }).addTo(map);

    var dropDownCitySelection = $('#dropDownCitySelection');
    $("input[name=display]").change(updateLayers);

    // add locator
    new LocateControl({
        keepCurrentZoomLevel: true,
        icon: 'icon locate',
        drawCircle: false,
        drawMarker: false,
    }).addTo(map);
    // load nearest city if the locator is clicked
    $('.icon.locate')
        .closest('a')
        .click(function(e) {
            e.preventDefault();
            showNearestCity(cityDirectory, false);
        });

    // Populate dropdown
    loadCities().fail(function(e) {
        console.log("loadCities(); failed: ", e);
    }).done(function(cities) {
        // cache the results
        cityDirectory = cities;
        $.each(cityDirectory, function(key, value) {
            var city = value;
            dropDownCitySelection.append(
                $('<option></option>').val(city.id)
                                      .html(city.label)
            );
        });
        dropDownCitySelection.select2({
            minimumResultsForSearch: 10
        }).change(function(e, keepCity) {
            // If we programmatically change the select2 value then we also
            // need to trigger 'change'. However that would cause an infinite
            // recursion in our case since we're doing that from inside
            // setCity. Therefore we add a custom "keepCity" parameter that is
            // set when the change event is triggered from within setCity so
            // that we can avoid a recursion in that case.
            if (!keepCity) {
                setCity(dropDownCitySelection.val(), true);
            }
        }).on('select2:close', function() {
            $(':focus').blur();
        });
        // Force select2 update to fix dropdown position
        dropDownCitySelection.select2('open');
        dropDownCitySelection.select2('close');

        setCity(getHashCity(), false);
    });

    $('#btnToggleHeader').click(toggleHeader);
    fixMapHeight();
});

