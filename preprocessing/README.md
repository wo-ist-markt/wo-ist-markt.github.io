# Preprocessing

This folder contains raw market data as published by cities and scripts to
convert it into GeoJSON format.


## Usage example (Berlin)

1. Download the latest raw market data and put in into the *raw*
folder as *markets-berlin.json*.
2. Convert the raw market data by running the following command from
the project root folder:

	``` bash
	$ preprocessing/berlin/compile-berlin-geojson.js
	```

    This will **overwrite** an existing file in *cities/berlin.json*.

3. Manually add the `metadata` block to this file afterwards!

	``` json
    "metadata": {
        "data_source": {
            "title": "Daten von der Stadt Berlin, CC BY 3.0 DE, aktualisiert am 12.01.2018",
            "url": "https://daten.berlin.de/datensaetze/wochen-und-tr%C3%B6delm%C3%A4rkte-0"
        }
    },
    ```
