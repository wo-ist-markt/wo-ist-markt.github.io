# Markets in Karlsruhe

A small visualization of the weekly farmer markets in [Karlsruhe][karlsruhe-wikipedia].

The raw data is [provided by the city of Karlsruhe][karlsruhe-wochenmarkte].


## Data format

* The market data is stored in [GeoJSON format][geojson].
* The opening hours use the [OpenStreetMap opening hours format][osm-openinghours].
* Opening hours that cannot be expressed in that format can use the `opening_hours_unclassified`
  property (in that case, set the `opening_hours` property to `null`).


### Mandatory information

* Besides the actual market information map **coordinates** and **zoom level** must be provided.
  These information are being used to set the initial position of the map. They must be part of
  the city-specific GeoJSON file. Please adapt the format as being used in *maerkte-karlsruhe.json*.


[geojson]: http://geojson.org
[osm-openinghours]: https://wiki.openstreetmap.org/wiki/Key:opening_hours/specification
[karlsruhe-wikipedia]: https://en.wikipedia.org/wiki/Karlsruhe
[karlsruhe-wochenmarkte]: http://www.karlsruhe.de/b3/maerkte/wochenmarkte.de
