# A map of farmer markets

A small visualization of the weekly markets in different cities.


## Data format

* The market data is stored in [GeoJSON format][geojson].
* The opening hours use the [OpenStreetMap opening hours format][osm-openinghours].
* Opening hours that cannot be expressed in that format can use the `opening_hours_unclassified`
  property (in that case, set the `opening_hours` property to `null`).


### Mandatory information

* Besides the actual market information map **coordinates** and **zoom level** must be provided.
  These information are being used to set the initial position of the map. They must be part of
  the city-specific GeoJSON file. Please adapt the format as being used in *cities/karlsruhe.json*.
* Further, the **data source** must be specified so it can be shown in the legend overlay.


## Navigation

* The individual market data for supported cities is displayed when the city name is given in the
  address bar of the browser.

  Example: https://codeforkarlsruhe.github.io/wo-ist-markt/#karlsruhe.

  By default or on error *Karlsruhe* is rendered.


## Supported cities

|City name|Data source|
|:---|:---|
|[Karlsruhe][karlsruhe-wikipedia]|[City of Karlsruhe][karlsruhe-wochenmarkte]|
|[Berlin][berlin-wikipedia]|[City of Berlin][berlin-wochenmarkte]|


## Development

Tests can be run using [npm][npm]:

    $ npm install  # Just once after you've cloned the repo

    $ npm test     # Whenever you want to run the tests


[geojson]: http://geojson.org
[osm-openinghours]: https://wiki.openstreetmap.org/wiki/Key:opening_hours/specification
[karlsruhe-wikipedia]: https://en.wikipedia.org/wiki/Karlsruhe
[karlsruhe-wochenmarkte]: http://www.karlsruhe.de/b3/maerkte/wochenmarkte.de
[berlin-wikipedia]: https://en.wikipedia.org/wiki/Berlin
[berlin-wochenmarkte]: http://daten.berlin.de/datensaetze/wochen-und-tr%C3%B6delm%C3%A4rkte
[npm]: https://www.npmjs.com
