var fs = require('fs'),
    path = require('path');

describe('CityList', function() {

    describe('cities.json', function() {

        it('should have at least one entry', function() {
            var cities = JSON.parse(fs.readFileSync('cities/cities.json'));
            expect(Object.keys(cities).length).toBeGreaterThan(0);
        });

        it('should contain only city objects', function() {
            var cities = JSON.parse(fs.readFileSync('cities/cities.json')),
                city;
            for (var i = 0, n = cities.length; i < n; i++) {
                city = cities[i];
                expect(city.id).toBeDefined();
                expect(city.label).toBeDefined();
            }
        });

        it('should have an entry for each city.json file', function() {
            var dirContent = fs.readdirSync('cities'),
                cities = JSON.parse(fs.readFileSync('cities/cities.json')),
                fileName,
                cityId,
                regexp = /json$/;
            var missingCities = dirContent
                .filter(function(fileName) {
                    return regexp.test(fileName) && fileName !== 'cities.json'
                })
                .map(function(fileName) {
                    return path.basename(fileName, '.json')
                })
                .filter(function(f) {
                    return !(f in cities)
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

    });

});
