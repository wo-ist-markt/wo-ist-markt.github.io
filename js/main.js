/*
 * © Code for Karlsruhe and contributors.
 * See the file LICENSE for details.
 */

var TILES_URL = '//cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png';
var ATTRIBUTION = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> ' +
                  'contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">' +
                  'CC-BY-SA</a>. Tiles &copy; <a href="http://cartodb.com/attributions">' +
                  'CartoDB</a>';
var DEFAULT_CITY = "karlsruhe";
var CITY_LIST_API_URL = 'https://api.github.com/repos/wo-ist-markt/' +
                        'wo-ist-markt.github.io/contents/cities';

var map;
var nowGroup = L.layerGroup();
var todayGroup = L.layerGroup();
var otherGroup = L.layerGroup();
var unclassifiedGroup = L.layerGroup();

var now = new Date();
var TIME_NOW = [now.getHours(), now.getMinutes()];
var DAY_INDEX = (now.getDay() + 6) % 7;  // In our data, first day is Monday
var DAY_NAMES = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
var DEFAULT_MARKET_TITLE = 'Markt';

L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';
var nowIcon = L.AwesomeMarkers.icon({markerColor: 'green', icon: 'shopping-cart'});
var todayIcon = L.AwesomeMarkers.icon({markerColor: 'darkgreen', icon: 'shopping-cart'});
var otherIcon = L.AwesomeMarkers.icon({markerColor: 'cadetblue', icon: 'shopping-cart'});
var unclassifiedIcon = L.AwesomeMarkers.icon({markerColor: 'darkpurple', icon: 'shopping-cart'});

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

/*
 * Creates time-table HTML code.
 *
 * `openingRanges` is a list of ranges compiled via opening_hours.js.
 * The first and second element of each range item are the starting and closing dates.
 */
function getTimeTable(openingRanges) {
    var html = '<table class="times">';
    if (openingRanges !== undefined) {
        for (var index = 0, openingRangesLength = openingRanges.length; index < openingRangesLength; ++index) {
            var openingRange = openingRanges[index];

            var dayIsToday = openingRangeMatchesDay(openingRange, now);
            var tableRow = getTableRowForDay(openingRange, dayIsToday);
            html += tableRow;
        }
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
    var formattedOpenFrom = moment(openFromDate).format('HH:mm');
    var formattedOpenTill = moment(openTillDate).format('HH:mm');
    return '<tr' + cls + '><th>' + dayName + '</th>' +
           '<td>' + formattedOpenFrom + ' - ' + formattedOpenTill + ' Uhr</td></tr>';
}

/*
 * Moves the map to its initial position.
 */
function positionMap(mapInitialization) {
    var coordinates = mapInitialization.coordinates;
    var zoomLevel = mapInitialization.zoom_level;
    map.setView(L.latLng(coordinates[1], coordinates[0]), zoomLevel);
}


/*
 * Initialize layer controls.
 *
 * Controls which serve no purpose are disabled. For example, if
 * currently no markets are open then the corresponding radio
 * button is disabled.
 */
function initControls() {
    var todayCount = todayGroup.getLayers().length;
    if (todayCount === 0) {
        // No markets today or all of today's markets currently open
        $('#today').attr('disabled', true);
    }
    if (nowGroup.getLayers().length > 0) {
        $('#now').attr('checked', true);
    } else {
        $('#now').attr('disabled', true);
        if (todayCount > 0) {
            $('#today').attr('checked', true);
        } else {
            $('#other').attr('checked', true);
        }
    }
    $("input[name=display]").change(updateLayers);
}

/*
 * Update layer visibility according to layer control settings.
 */
function updateLayers() {
    var value = document.querySelector('[name="display"]:checked').value;
    switch (value) {
        case "now":
            map.removeLayer(todayGroup);
            map.removeLayer(otherGroup);
            break;
        case "today":
            map.addLayer(todayGroup);
            map.removeLayer(otherGroup);
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
    var range = moment.range(openingRange[0], openingRange[1]);
    return range.contains(date);
}

/*
 * Returns opening ranges compiled via opening_hours.js.
 */
function getOpeningRanges(openingHoursStrings) {
    var monday = moment().startOf("week").add(1, 'days').toDate();
    var sunday = moment().endOf("week").add(1, 'days').toDate();
    var oh = new opening_hours(openingHoursStrings);
    return oh.getOpenIntervals(monday, sunday);
}

/*
 * Returns opening range for date or undefined.
 */
function getOpeningRangeForDate(openingRanges, date) {
    if (openingRanges !== undefined) {
        for (var index = 0, openingRangesLength = openingRanges.length; index < openingRangesLength; ++index) {
            var openingRange = openingRanges[index];

            var dayIsToday = openingRangeMatchesDay(openingRange, date);
            if (dayIsToday) {
                return openingRange;
            }
        }
    }
    return undefined;
}

/*
 * Create map markers from JSON market data.
 */
function initMarkers(featureCollection) {
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
        var openingRanges = getOpeningRanges(openingHoursStrings);
        todayOpeningRange = getOpeningRangeForDate(openingRanges, now);
        timeTableHtml = getTimeTable(openingRanges);
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
    var title = properties.title;
    if (title === undefined) {
        throw "Missing property 'title'.";
    }
    if (title === null || title.length === 0) {
        title = DEFAULT_MARKET_TITLE;
    }
    var popupHtml = '<h1>' + title + '</h1>' + where;
    if (openingHoursUnclassified !== undefined) {
        popupHtml += '<p class="unclassified">' + openingHoursUnclassified + '</p>';
    } else {
        popupHtml += timeTableHtml;
    }
    marker.bindPopup(popupHtml);
    if (todayOpeningRange !== undefined) {
        if (openingRangeContainsTime(todayOpeningRange, now)) {
            marker.setIcon(nowIcon);
            nowGroup.addLayer(marker);
        } else {
            marker.setIcon(todayIcon);
            todayGroup.addLayer(marker);
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
 * Returns the city name when present in the hash of the current URI;
 * otherwise the default city name;
 */
function getCityName() {
    var hash = decodeURIComponent(window.location.hash);
    if (hash === undefined || hash === "") {
        return DEFAULT_CITY;
    } else {
        hash = hash.toLowerCase();
        return hash.substring(1, hash.length);
    }
}


/*
 * Updates the URL hash in the browser.
 */
function updateUrlHash(cityName) {
    if (cityName === undefined) {
        throw "City name is undefined.";
    }
    if (history.pushState) {
        history.pushState(null, null, "#" + cityName);
    } else {
        window.location.hash = cityName;
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
function updateLegendDataSource(dataSource) {
    var title = dataSource.title;
    var url = dataSource.url;
    $("#legend #dataSource").html('<a href="' + url + '">' + title + '</a>');
}


/*
 * Convert a city ID to a UI label.
 */
function cityIdToLabel(s) {
    return s.replace(/(^|\s|\-)([a-zA-ZäöüÄÖÜß])/g, function (x) {
        return x.toUpperCase();
    });
}


/*
 * Set the current city.
 *
 * `city` is the city ID.
 */
function setCity(city) {
    var filename = 'cities/' + city + '.json';
    $.getJSON(filename, function(json) {
        positionMap(json.metadata.map_initialization);
        updateLegendDataSource(json.metadata.data_source);
        initMarkers(json);
        initControls();
        map.addLayer(unclassifiedGroup);
        map.addLayer(nowGroup);
        updateLayers();
        updateUrlHash(city);
        document.title = 'Wo ist Markt in ' + cityIdToLabel(city) + '?';
        // Update drop down but avoid recursion
        $('#dropDownCitySelection').val(city).trigger('change', true);
    }).fail(function() {
        console.log('Failure loading "' + filename + '".');
        if (city !== DEFAULT_CITY) {
            console.log('Loading default city "' + DEFAULT_CITY +
                        '" instead.');
            setCity(DEFAULT_CITY);
        }
    });
}


/*
 * Load the IDs of the available cities.
 *
 * Returns a jQuery `Deferred` object that resolves to an array of city IDs.
 */
function loadCityIDs() {
    var d = $.Deferred();
    $.get(CITY_LIST_API_URL, function(result) {
        var ids = [];
        $.each(result, function(_, file) {
            if (file.name.indexOf('.json', file.name.length - 5) !== -1) {
                ids.push(file.name.slice(0, -5));
            }
        });
        d.resolve(ids);
    }).fail(function() {
        d.fail();
    });
    return d;
}


$(window).on('hashchange',function() {
    setCity(getCityName());
});


$(document).ready(function() {
    var tiles = new L.TileLayer(TILES_URL, {attribution: ATTRIBUTION});
    map = new L.Map('map').addLayer(tiles);
    var legend = L.control({position: 'bottomright'});
    var dropDownCitySelection = $('#dropDownCitySelection');
    legend.onAdd = function () { return L.DomUtil.get('legend'); };

    // Populate dropdown
    loadCityIDs().done(function(cityIDs) {
        for (var i = 0; i < cityIDs.length; i++) {
            var id = cityIDs[i];
            dropDownCitySelection.append(
                $('<option></option>').val(id)
                                      .html(cityIdToLabel(id))
            );
        }
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
                setCity(dropDownCitySelection.val());
            }
        }).on('select2:close', function() {
            $(':focus').blur();
        });
        // Force select2 update to fix dropdown position
        dropDownCitySelection.select2('open');
        dropDownCitySelection.select2('close');

        setCity(getCityName());
    });

    // Stop map movement by mouse events in legend.
    // See https://gis.stackexchange.com/a/106777/48264.
    L.DomEvent.disableClickPropagation(L.DomUtil.get('legend'));

    legend.addTo(map);
});

