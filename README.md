# A map of farmer markets

A small visualization of the weekly markets in different cities. Available at: http://wo-ist-markt.de


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

  Example: http://wo-ist-markt.de/#karlsruhe.

  By default or on error *Karlsruhe* is rendered.


## Supported cities

|City name|Data source|
|:---|:---|
|[Berlin][berlin-wikipedia]|[City of Berlin][berlin-wochenmarkte]|
|[Karlsruhe][karlsruhe-wikipedia]|[City of Karlsruhe][karlsruhe-wochenmarkte]|
|[Leipzig][leipzig-wikipedia]|[City of Leipzig][leipzig-wochenmarkte]|
|[Münster][muenster-wikipedia]|[City of Münster][muenster-wochenmarkte]|
|[Paderborn][paderborn-wikipedia]|[City of Paderborn][paderborn-wochenmarkte]|


## Contributing

* Please make sure to read the [contributing guide](CONTRIBUTING.md).


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
[muenster-wikipedia]: https://en.wikipedia.org/wiki/M%C3%BCnster
[muenster-wochenmarkte]: http://www.muenster.de/stadt/maerkte/markt.html
[leipzig-wikipedia]: https://en.wikipedia.org/wiki/Leipzig
[leipzig-wochenmarkte]: https://www.leipzig.de/freizeit-kultur-und-tourismus/einkaufen-und-ausgehen/maerkte/
[paderborn-wikipedia]: https://en.wikipedia.org/wiki/Paderborn
[paderborn-wochenmarkte]: http://www.paderborn.de/microsite/wochenmarkt/marktinfos/109010100000079411.php?p=5,1
