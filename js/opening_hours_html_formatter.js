//
// opening_hours_html_formatter.js 0.1.0
// https://github.com/wo-ist-markt/opening_hours_html_formatter.js
//

// Generated at 2017-03-01 08:42:59

/*
 * A day class containing opening ranges.
 */
function Day() {

    this.openingRanges = [];

    this.addOpeningRange = function(openingRange) {
        this.openingRanges.push(openingRange);
    };

    this.addOpeningRanges = function(openingRanges) {
        for (var i = 0; i < openingRanges.length; i++) {
            this.addOpeningRange(openingRanges[i]);
        }
    };

    /*
     * Returns the day name index of the first opening range object
     * or -1 if there is no opening range object.
     */
    this.getDayNameIndex = function() {
        return this.openingRanges === [] ? -1 : this.openingRanges[0].getDayNameIndex();
    };

    this.getFormattedOpeningRanges = function() {
        return this.openingRanges.map(
            function(openingRange) {
                return openingRange.getFormattedOpeningRange();
            }
        ).join(", ");
    };

}


if (typeof window.ohhf === "undefined") {
    window.ohhf = {};
}
window.ohhf.Day = Day;

/*
 * Formatter for an opening range.
 * The actually formatting is dispatched to the moment.js library.
 */
function OpeningRangeFormatter() {

    this.getRangeDelimiter = function() {
        return " - ";
    };

    this.getFormattedDate = function(date) {
        if (typeof date === "undefined") {
            throw new Error("Parameter 'date' cannot be undefined.");
        }
        return moment(date).format('HH:mm');
    };

}

if (typeof window.ohhf === "undefined") {
    window.ohhf = {};
}
window.ohhf.OpeningRangeFormatter = OpeningRangeFormatter;

/*
 * An opening range class containg a from and a till date.
 *
 * - openingRange: An openingRange object created by the opening_hours.js library.
 * - formatter: An OpeningRangeFormatter object.
 */
function OpeningRange(openingRange, formatter) {

    this.fromDate = openingRange[0];
    this.tillDate = openingRange[1];
    this.formatter = formatter;

    /*
     * Returns the index of the day associated with the day name.
     * The fromDate is used as a lookup source.
     * It is zero indexed with the 0th item pointing to Sunday.
     */
    this.getDayNameIndex = function() {
        return this.fromDate.getDay();
    };

    /*
     * Returns the name of the given day names
     * at the position of the index.
     *
     * - dayNames: Array of day names. Must be zero indexed, starting with Sunday.
     */
    this.getDayName = function(dayNames) {
        return dayNames[this.getDayNameIndex()];
    };

    this.getFormattedOpeningRange = function() {
        return this.getFormattedFromDate() +
        this.formatter.getRangeDelimiter() +
        this.getFormattedTillDate();
    };

    this.getFormattedFromDate = function() {
        return this.formatter.getFormattedDate(this.fromDate);
    };

    this.getFormattedTillDate = function() {
        return this.formatter.getFormattedDate(this.tillDate);
    };

}

if (typeof window.ohhf === "undefined") {
    window.ohhf = {};
}
window.ohhf.OpeningRange = OpeningRange;

/*
 * Creates an OpeningTimes object from the given string.
 * To parse the string opening_hours.js and moment.js are used.
 *
 * The OpeningTimes object can be one of the following:
 * - next opening date
 * - opening ranges
 * - undefined if no next opening date or ranges are available
 */
function OpeningTimes(openingHoursStrings) {

    this.openingHoursStrings = openingHoursStrings;
    this.openingTimes = undefined;

    this.getOpeningRanges = function() {
        if (typeof this.openingTimes === "undefined") {
            this.openingTimes = this.calculateOpeningTimes();
        }
        if (typeof this.openingTimes !== "undefined" && this.openingTimes.hasOwnProperty('intervals')) {
            return this.openingTimes.intervals;
        }
        return undefined;
    };

    this.getNextOpeningDate = function() {
        if (typeof this.openingTimes === "undefined") {
            this.openingTimes = this.calculateOpeningTimes();
        }
        if (typeof this.openingTimes !== "undefined" && this.openingTimes.hasOwnProperty('nextChange')) {
            return this.openingTimes.nextChange;
        }
        return undefined;
    };

    /*
     * Returns opening times compiled via opening_hours.js.
     * Returns a object with the next opening date or opening ranges if available.
     * Returns undefined if no next opening date or ranges are available.
     */
    this.calculateOpeningTimes = function() {
        var sundayIndex = 0;
        var shiftBy;
        if (moment().weekday() === sundayIndex) {
            shiftBy = -1;
        } else {
            shiftBy = 1;
        }
        var monday = moment().startOf("week").add(shiftBy, 'days').toDate();
        var sunday = moment().endOf("week").add(shiftBy, 'days').toDate();
        var oh = new opening_hours(this.openingHoursStrings);
        var intervals = oh.getOpenIntervals(monday, sunday);
        var nextChange = oh.getNextChange();

        if (intervals.length > 0) {
            /* Return opening ranges */
            return {
                intervals: intervals
            };
        } else if (typeof nextChange !== "undefined") {
            /* Return next opening date */
            return {
                nextChange: nextChange
            };
        } else {
            return undefined;
        }
    };

}

if (typeof window.ohhf === "undefined") {
    window.ohhf = {};
}
window.ohhf.OpeningTimes = OpeningTimes;

if (typeof window.ohhf === "undefined") {
    window.ohhf = {};
}
window.ohhf.version = "0.1.0";

/*
 * Creates a Week object from the given opening ranges.
 * The opening ranges have to be extracted from an opening_hours.js object.
 */
function WeekGenerator() {

    /*
     * Returns a Week object.
     *
     * - openingRanges - An array of Date objects (even amount) describing from and till times.
     * - openingRangeFormatter - A OpeningRangeFormatter object.
     */
    this.getWeek = function(openingRanges, openingRangeFormatter) {
        if (typeof openingRanges === "undefined") {
            throw new Error("Parameter 'openingRanges' cannot be undefined.");
        }
        if (typeof openingRangeFormatter === "undefined") {
            throw new Error("Parameter 'openingRangeFormatter' cannot be undefined.");
        }
        var week = new Week();
        for (var i = 0; i < openingRanges.length; ++i) {
            var openingRange = openingRanges[i];
            var day = new Day();
            var range = new OpeningRange(openingRange, openingRangeFormatter);
            day.addOpeningRange(range);
            week.addDay(day);
        }
        return week;
    };

}

if (typeof window.ohhf === "undefined") {
    window.ohhf = {};
}
window.ohhf.WeekGenerator = WeekGenerator;

/*
 * A week consisting of named days (Monday - Sunday).
 */
function Week() {
    var self = this;

    this.monday = undefined;
    this.tuesday = undefined;
    this.wednesday = undefined;
    this.thursday = undefined;
    this.friday = undefined;
    this.saturday = undefined;
    this.sunday = undefined;

    this.FIELD_NAMES_ENGLISH = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    /*
     * Adds a Day object.
     * New and existing days which match by their name are merged.
     */
    this.addDay = function(specificDay) {
        if (typeof specificDay === "undefined") {
            throw new Error("Parameter 'specificDay' cannot be undefined.");
        }
        var openingRanges = specificDay.openingRanges;
        for (var i = 0; i < openingRanges.length; i++) {
            var openingRange = openingRanges[i];
            // TODO Get rid of this order dependency.
            // The array must start with Sunday because Date.getDay() is zero indexed.
            var dayName = openingRange.getDayName(this.FIELD_NAMES_ENGLISH);
            this[dayName] = this.getUpdatedDay(this[dayName], specificDay);        }
    };

    /*
     * Returns an array of days ordered from Monday to Sunday.
     * A day is only added to the array if it is defined.
     */
    this.getDays = function() {
        return self.FIELD_NAMES_ENGLISH
            .filter(function(dayName) {
                return typeof self[dayName] !== "undefined";
            }).map(function(dayName) {
                return self[dayName];
            });
    };

    this.getUpdatedDay = function(day, specificDay) {
        if (typeof day === "undefined") {
            day = specificDay;
        } else {
            day.addOpeningRanges(specificDay.openingRanges);
        }
        return day;
    };

}

if (typeof window.ohhf === "undefined") {
    window.ohhf = {};
}
window.ohhf.Week = Week;

/*
 * An HTML generator for week data.
 * Outputs an HTML table with a row for each week day
 * which has corresponding opening hours.
 * If the day matches today the row is styled.
 *
 * - week: A Week object.
 * - today: A date object for now.
 * - dayNames: An array of day names to be shown in the table. Must be zero indexed, starting with Sunday.
 */
function WeekTableHtmlGenerator(week, today, dayNames) {

    this.week = week;
    this.today = today;
    this.dayNames = dayNames;

    this.getHtml = function() {
        var week = this.getWeek();
        return week.outerHTML;
    };

    this.getWeek = function() {
        var table = this.getTable();
        var days = this.week.getDays();
        for (var i = 0; i < days.length; i++) {
            var row = this.getDay(days[i]);
            table.appendChild(row);
        }
        return table;
    };

    this.getDay = function(day) {
        var row = this.getTableRow(day);
        var header = this.getDayNameCell(day);
        row.appendChild(header);
        var cell = this.getOpeningRangesCell(day);
        row.appendChild(cell);
        return row;
    };

    this.getTable = function() {
        var table = document.createElement("table");
        table.classList.add("times");
        return table;
    };

    this.getTableRow = function(day) {
        var row = document.createElement("tr");
        var dayNameIndex = day.getDayNameIndex();
        var dayIsToday = this.today.getDay() === dayNameIndex;
        if (dayIsToday) {
            row.classList.add("today");
        }
        return row;
    };

    this.getDayNameCell = function(day) {
        var header = document.createElement("th");
        var dayName = this.dayNames[day.getDayNameIndex()];
        var text = document.createTextNode(dayName);
        header.appendChild(text);
        return header;
    };

    this.getOpeningRangesCell = function(day) {
        var cell = document.createElement("td");
        var ranges = day.getFormattedOpeningRanges();
        var text = document.createTextNode(ranges + " Uhr");
        cell.appendChild(text);
        return cell;
    };

}

if (typeof window.ohhf === "undefined") {
    window.ohhf = {};
}
window.ohhf.WeekTableHtmlGenerator = WeekTableHtmlGenerator;

