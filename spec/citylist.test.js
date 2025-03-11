import { test } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';

function normalizeString(string) {
    return string.normalize();
}

test('CityList', async (t) => {
    await t.test('cities.json', async (t) => {
        await t.test('should have at least one entry', () => {
            const cities = JSON.parse(fs.readFileSync('cities/cities.json'));
            t.assert.ok(Object.keys(cities).length > 0, 'Cities list should not be empty');
        });

        await t.test('should contain only city objects', () => {
            const cities = JSON.parse(fs.readFileSync('cities/cities.json'));
            const keys = Object.keys(cities);

            for (const key of keys) {
                const city = cities[key];
                t.assert.ok(city.id !== undefined, `City "${key}" requires property "id"`);
                t.assert.ok(city.label !== undefined, `City "${key}" requires property "label"`);
                t.assert.ok(Object.keys(city).length <= 3, 'Cities should only have the properties id, label and an optional position');
            }
        });

        await t.test('should contain valid positions', () => {
            const cities = JSON.parse(fs.readFileSync('cities/cities.json'));
            for (const city of Object.values(cities)) {
                if (city.position) {
                    t.assert.ok(Array.isArray(city.position), 'Position should be an array');
                    t.assert.strictEqual(city.position.length, 2, 'Position should have exactly 2 coordinates');
                    t.assert.strictEqual(typeof city.position[0], 'number', 'First coordinate should be a number');
                    t.assert.ok(city.position[0] >= -180 && city.position[0] <= 180, 'First coordinate should be between -180 and 180');
                    t.assert.strictEqual(typeof city.position[1], 'number', 'Second coordinate should be a number');
                    t.assert.ok(city.position[1] >= -180 && city.position[1] <= 180, 'Second coordinate should be between -180 and 180');
                }
            }
        });

        await t.test('should have an entry for each city.json file', () => {
            const dirContent = fs.readdirSync('cities');
            const cities = JSON.parse(fs.readFileSync('cities/cities.json'));
            const regexp = /json$/;

            const cityNames = Object.keys(cities).map(normalizeString);

            const missingCities = dirContent
                .filter(fileName => regexp.test(fileName) && fileName !== 'cities.json')
                .map(fileName => {
                    const cityName = path.basename(fileName, '.json');
                    return normalizeString(cityName);
                })
                .filter(cityName => !cityNames.includes(cityName));

            t.assert.deepStrictEqual(missingCities, [], `Missing cities in cities.json: ${missingCities.join(', ')}`);
        });

        await t.test('should have a city specific json file for each city in the list', () => {
            const cities = JSON.parse(fs.readFileSync('cities/cities.json',  { encoding: 'utf8' }));

            for (const city of Object.values(cities)) {
                const cityPath = `cities/${city.id}.json`;
                const cityGeoJson = fs.readFileSync(cityPath);
                t.assert.ok(JSON.parse(cityGeoJson).type !== undefined, `City ${city.id} should have a toplevel type field.`);
            }
        });

        await t.test('should only have entries where the key and the id match', () => {
            const cities = JSON.parse(fs.readFileSync('cities/cities.json'));
            const keys = Object.keys(cities);

            for (const key of keys) {
                const city = cities[key];
                t.assert.strictEqual(key, city.id, 'Key and id do not match');
            }
        });
    });
});
