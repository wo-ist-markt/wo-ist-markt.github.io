/*
 * © Code for Karlsruhe and contributors.
 * See the file LICENSE for details.
 */

var TILES_URL = '//cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png';
var ATTRIBUTION = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> ' +
                  'contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">' +
                  'CC-BY-SA</a>. Tiles &copy; <a href="http://cartodb.com/attributions">' +
                  'CartoDB</a>';

var DEFAULT_CITY_ID = "karlsruhe";
var CITIES_URL = 'build/cities.json';
var MARKETS_URL = 'build/markets.json';

var cities = {}; // City metadata (initialized in ready())
var markets = {}; // Markets data (initialized in ready())

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
function getTimeTableHtml(openingRanges) {
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
 * Format HTML for next market date
 */
function getNextMarketDateHtml(nextChange) {
    var html = '<p class="times">Nächster Termin: ' +
        moment(nextChange).format('DD. MMM') + ' ab ' +
        moment(nextChange).format('HH:mm') + ' Uhr.</p>';
    return html;
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
 * Flash `element` `flashes` times for `duration` milliseconds.
 */
function flash(element, flashes, duration) {
    if (flashes === 0) {
        return;
    }
    flashes = flashes || 5;
    duration = duration || 300;
    element = $(element);
    element.fadeToggle(duration, function() {
        element.fadeToggle(duration, function() {
            flash(element, flashes - 1, duration);
        });
    });
}


/*
 * Update layer controls.
 *
 * Enables those controls for which markers exist within the current map
 * bounds. For example, if there are no currently open markets within the
 * map bounds then the "now" radio button is disabled. If a more restrictive
 * control gets enabled then the most restrictive enabled control is flashed
 * to let the user know about it.
 *
 * If it turns out that the currently active setting is too restrictive for
 * the new map bounds (i.e. if no markets for the active setting are available
 * but markets for a lower setting are available) then the next lower setting
 * for which markets are available is activated instead. If no markets are
 * available within the bounds at all then the "all" setting is activated. If
 * the setting is changed during that process then the newly activated control
 * is flashed to let the user know about it.
 */
function updateControls() {
    var nowElement = $('#now');
    var todayElement = $('#today');
    var nowCount = countPotentiallyVisibleMarkers(nowGroup);
    var hadNow = !nowElement.prop('disabled');
    var gotNow = nowCount > 0;
    var gotToday = true;
    nowElement.prop('disabled', !gotNow);
    if (gotNow && !hadNow) {
        flash(nowElement.parent());
    }
    if (!gotNow) {
        var todayCount = countPotentiallyVisibleMarkers(todayGroup);
        gotToday = todayCount > 0;
        var hadToday = !todayElement.prop('disabled');
        todayElement.prop('disabled', !gotToday);
        if (gotToday && !hadToday) {
            flash(todayElement.parent());
        }
    }

    var input = document.querySelector('[name="display"]:checked');
    if (input) {
        // Check if current setting still makes sense
        var currentSetting = input.value;
        var newSetting = currentSetting;
        if (currentSetting === 'now' && !gotNow) {
            if (gotToday) {
                newSetting = 'today';
            } else {
                newSetting = 'other';
            }
        } else if (currentSetting === 'today' && !gotToday) {
            newSetting = 'other';
        }
        if (newSetting !== currentSetting) {
            var element = $('#' + newSetting);
            element.prop('checked', true);
            flash(element.parent());
        } else {
        }
    } else {
        // No previous setting, select the most specific enabled option
        if (gotNow) {
            nowElement.prop('checked', true);
        } else if (gotToday) {
            todayElement.prop('checked', true);
        } else {
            $('#other').prop('checked', true);
        }
    }

    updateLayers();
}


/*
 * Count markers within the current map bounds.
 *
 * Count the number of market markers in a layer group that are within the
 * current map bounds, regardless of whether they are currently displayed
 * or not.
 */
function countPotentiallyVisibleMarkers(group) {
    var bounds = map.getBounds();
    var count = 0;
    group.eachLayer(function(layer) {
        if (bounds.contains(layer.getLatLng())) {
            count++;
        }
    });
    return count;
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
    var range = moment.range(openingRange[0], openingRange[1]);
    return range.contains(date);
}

/*
 * Returns opening times compiled via opening_hours.js.
 * Returns a object with the next opening date or opening ranges if available.
 * Returns null if no next opening date or ranges are available.
 */
function getOpeningTimes(openingHoursStrings) {
    var sundayIndex = 0;
    var shiftBy;
    if (moment().weekday() === sundayIndex) {
        shiftBy = -1;
    } else {
        shiftBy = 1;
    }
    var monday = moment().startOf("week").add(shiftBy, 'days').toDate();
    var sunday = moment().endOf("week").add(shiftBy, 'days').toDate();
    var oh = new opening_hours(openingHoursStrings);
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
function updateDataSource(dataSource) {
    var title = dataSource.title;
    var url = dataSource.url;
    $("#dataSource").html('<a href="' + url + '">' + title + '</a>');
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
    if (!(cityID in cities)) {
        cityID = DEFAULT_CITY_ID;
    }
    cityData = cities[cityID];
    positionMap(cityData.map_initialization);
    updateDataSource(cityData.data_source);
    updateLayers();
    updateUrlHash(cityID, createNewHistoryEntry);
    document.title = 'Wo ist Markt in ' + cityData.label + '?';

    // Update drop down but avoid recursion
    $('#dropDownCitySelection').val(cityID).trigger('change', true);
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

$(window).on('resize', fixMapHeight);


$(window).on('hashchange',function() {
    // Don't create a new history state, because the hash change already did
    setCity(getHashCity(), false);
});


/*
 * Initialize the cities dropdown.
 *
 * Assumes that `cities` has been initialized.
 */
function initDropDown() {
    var dropDownCitySelection = $('#dropDownCitySelection');
    $.each(cities, function(id, city) {
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
}


/*
 * Initialize markers based on markets data.
 *
 * Assumes that `markets` has been initialized.
 */
function initMarkers() {
    L.geoJson(markets, {
        onEachFeature: initMarker
    });
}


/*
 * Initialize a single marker from a market's GeoJSON data.
 */
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


$(document).ready(function() {
    var tiles = new L.TileLayer(TILES_URL, {attribution: ATTRIBUTION});
    map = new L.Map('map').addLayer(tiles);
    map.on('moveend', updateControls);
    $("input[name=display]").change(updateLayers);

    // add locator
    L.control.locate({keepCurrentZoomLevel: true}).addTo(map);

    // Initialize markers
    var marketsDeferred = $.get(MARKETS_URL)
        .done(function(json) {
            markets = json; // global
            initMarkers();
        });

    // Populate dropdown
    var citiesDeferred = $.get(CITIES_URL)
        .done(function(json) {
            cities = json; // global
            initDropDown();
        });

    $.when(marketsDeferred, citiesDeferred)
        .fail(function(e) {
            console.log('Loading the data failed: ', e);
        })
        .done(function() {
            setCity(getHashCity(), false);
        });

    $('#btnToggleHeader').click(toggleHeader);
    fixMapHeight();
});

