[![Build Status](https://travis-ci.org/wo-ist-markt/wo-ist-markt.github.io.svg?branch=master)](https://travis-ci.org/wo-ist-markt/wo-ist-markt.github.io)

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
|[Berlin][berlin-wikipedia]|[City of Berlin][berlin-markets]|
|[Erlangen][erlangen-wikipedia]|[City of Erlangen][erlangen-markets]|
|[Karlsruhe][karlsruhe-wikipedia]|[City of Karlsruhe][karlsruhe-markets]|
|[Köln][koeln-wikipedia]|[City of Köln][koeln-markets]|
|[Leipzig][leipzig-wikipedia]|[City of Leipzig][leipzig-markets]|
|[München][muenchen-wikipedia]|[City of München][muenchen-markets]|
|[Münster][muenster-wikipedia]|[City of Münster][muenster-markets]|
|[Neu-Ulm][neu-ulm-wikipedia]|[City of Neu-Ulm][neu-ulm-markets]|
|[Paderborn][paderborn-wikipedia]|[City of Paderborn][paderborn-markets]|
|[Ulm][ulm-wikipedia]|[City of Ulm][ulm-markets]|



## Contributing

* Please make sure to read the [contributing guide](CONTRIBUTING.md).


## Development

Tests can be run using [npm][npm]:

    $ npm install  # Just once after you've cloned the repo

    $ npm test     # Whenever you want to run the tests


[geojson]: http://geojson.org
[osm-openinghours]: https://wiki.openstreetmap.org/wiki/Key:opening_hours/specification
[npm]: https://www.npmjs.com

[berlin-wikipedia]: https://en.wikipedia.org/wiki/Berlin
[berlin-markets]: http://daten.berlin.de/datensaetze/wochen-und-tr%C3%B6delm%C3%A4rkte
[erlangen-wikipedia]: https://en.wikipedia.org/wiki/Erlangen
[erlangen-markets]: http://www.erlangen.de
[koeln-wikipedia]: https://en.wikipedia.org/wiki/Cologne
[koeln-markets]: http://www.offenedaten-koeln.de/dataset/wochenmaerkte-koeln
[karlsruhe-wikipedia]: https://en.wikipedia.org/wiki/Karlsruhe
[karlsruhe-markets]: http://www.karlsruhe.de/b3/maerkte/wochenmarkte.de
[leipzig-wikipedia]: https://en.wikipedia.org/wiki/Leipzig
[leipzig-markets]: https://www.leipzig.de/freizeit-kultur-und-tourismus/einkaufen-und-ausgehen/maerkte/
[muenchen-wikipedia]: https://en.wikipedia.org/wiki/M%C3%BCnchen
[muenchen-markets]: https://www.opengov-muenchen.de/dataset/maerkte
[muenster-wikipedia]: https://en.wikipedia.org/wiki/M%C3%BCnster
[muenster-markets]: http://www.muenster.de/stadt/maerkte/markt.html
[neu-ulm-wikipedia]: https://en.wikipedia.org/wiki/Neu-Ulm
[neu-ulm-markets]: http://nu.neu-ulm.de/de/neu-ulm-erleben/veranstaltungen/feste-maerkte/wochenmarkt/
[paderborn-wikipedia]: https://en.wikipedia.org/wiki/Paderborn
[paderborn-markets]: http://www.paderborn.de/microsite/wochenmarkt/marktinfos/109010100000079411.php?p=5,1
[ulm-wikipedia]: https://en.wikipedia.org/wiki/Ulm
[ulm-markets]: http://www.ulm-messe.de/marktwesen/wochenmarkt_ulm_soeflingen.97943.21332,97940,97943.htm
