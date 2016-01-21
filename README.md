# Markets in Karlsruhe

A small visualization of the weekly farmer markets in [Karlsruhe](https://en.wikipedia.org/wiki/Karlsruhe).

The raw data is [provided by the City of Karlsruhe](http://www.karlsruhe.de/b3/maerkte/wochenmarkte.de).


## Data Format

* The market data is stored in [GeoJSON format](http://geojson.org/) (its URL can be set at the top of `js/main.js`).
* The opening hours use the [OpenStreetMap opening hours format](https://wiki.openstreetmap.org/wiki/Key:opening_hours/specification).
* Opening hours that cannot be expressed in that format can use the `opening_hours_unclassified` property (in that case, set the `opening_hours` property to `null`).

