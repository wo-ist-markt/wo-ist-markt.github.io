var fs = require('fs'),
    path = require('path');


function normalizeString(string){
    return string.normalize();
}

describe('CityList', function() {

    describe('cities.json', function() {

        it('should have at least one entry', function() {
            var cities = JSON.parse(fs.readFileSync('cities/cities.json'));
            expect(Object.keys(cities).length).toBeGreaterThan(0);
        });

        it('should contain only city objects', function() {
            var cities = JSON.parse(fs.readFileSync('cities/cities.json')),
                keys = Object.keys(cities),
                city,
                key;
            for (var i = 0, n = keys.length; i < n; i++) {
                key = keys[i];
                city = cities[key];
                expect(city.id).toBeDefined('City "' + key + '" requires property "id".');
                expect(city.label).toBeDefined('City "' + key + '" requires property "label".');
                expect(Object.keys(city).length <= 2).toBe(true, 'Cities should only have the properties id and label.');
            }
        });

        it('should have an entry for each city.json file', function() {
            var dirContent = fs.readdirSync('cities'),
                cities = JSON.parse(fs.readFileSync('cities/cities.json')),
                regexp = /json$/;

            var cityNames = Object.keys(cities).map(normalizeString);

            var missingCities = dirContent
                .filter(function(fileName) {
                    return regexp.test(fileName) && fileName !== 'cities.json'
                })
                .map(function(fileName) {
                    var cityName = path.basename(fileName, '.json');
                    return normalizeString(cityName);
                })
                .filter(function(cityName) {
                    return !(cityNames.includes(cityName))
                });
            expect(missingCities).toEqual([], "Missing cities in cities.json: " + missingCities.join(", "));
        });

        it('should have a city specific json file for each city in the list', function() {
            var cities = JSON.parse(fs.readFileSync('cities/cities.json')),
                city,
                cityPath,
                cityGeoJson,
                keys = Object.keys(cities);
            for (var i = 0, n = keys.length; i < n; i++) {
                city = cities[keys[i]];
                cityPath = 'cities/' + city.id + '.json';
                cityGeoJson = fs.readFileSync(cityPath);
                expect(JSON.parse(cityGeoJson).type).toBeDefined();
            }
        });

        it('should only have entries where the key and the id match', function() {
            var cities = JSON.parse(fs.readFileSync('cities/cities.json')),
                keys = Object.keys(cities),
                key;
            for (var i = 0, n = keys.length; i < n; i++) {
                key = keys[i];
                city = cities[key];
                expect(key).toBe(city.id, "Key and id do not match");
            }
        });

    });

});
