import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

// Matches a Markdown reference definition such as:
// [berlin-markets]: https://www.example.com/markets
const REFERENCE_DEFINITION = /^\[([^\]]+)\]:\s+(\S+)$/;

// Matches a Markdown reference link such as:
// [City of Berlin][berlin-markets]
const REFERENCE_LINK = /^\[([^\]]+)\]\[([^\]]+)\]$/;

test('each configured city data source is documented in README', () => {
    const readmeDataSources = readReadmeDataSources();
    const cityDataSources = readCityDataSources();

    for (const cityDataSource of cityDataSources) {
        const matches = readmeDataSources.filter(readmeDataSource =>
            cityNamesMatch(readmeDataSource.cityName, cityDataSource.cityName)
        );

        assert.strictEqual(matches.length, 1, `Expected one README entry for "${cityDataSource.cityName}"`);
        assert.strictEqual(
            matches[0].url,
            cityDataSource.url,
            `Data source URL for "${cityDataSource.cityName}" does not match`
        );
    }
});

test('each README data source belongs to a configured city', () => {
    const readmeDataSources = readReadmeDataSources();
    const cityDataSources = readCityDataSources();

    for (const readmeDataSource of readmeDataSources) {
        const matches = cityDataSources.filter(cityDataSource =>
            cityNamesMatch(readmeDataSource.cityName, cityDataSource.cityName)
        );

        assert.strictEqual(matches.length, 1, `Expected one configured city for "${readmeDataSource.cityName}"`);
    }
});

function normalizeCityName(name) {
    return name
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\([^)]*\)/g, '')
        .trim()
        .toLowerCase()
        .replace(/ue/g, 'u')
        .replace(/oe/g, 'o')
        .replace(/ae/g, 'a')
        .replace(/ß/g, 'ss');
}

function cityNamesMatch(firstName, secondName) {
    const first = normalizeCityName(firstName);
    const second = normalizeCityName(secondName);

    return first === second || first.startsWith(second) || second.startsWith(first);
}

function parseReferenceLink(value) {
    const match = value.match(REFERENCE_LINK);
    return match ? { label: match[1], reference: match[2].toLowerCase() } : null;
}

function readReadmeDataSources() {
    const lines = fs.readFileSync('README.md', 'utf8').split('\n');
    const linkDefinitions = new Map();

    for (const line of lines) {
        const match = line.match(REFERENCE_DEFINITION);
        if (match) {
            linkDefinitions.set(match[1].toLowerCase(), match[2]);
        }
    }

    const dataSources = [];
    for (const line of lines) {
        const columns = line.split('|').map(column => column.trim()).filter(Boolean);
        if (columns.length !== 2) {
            continue;
        }

        const cityLink = parseReferenceLink(columns[0]);
        const dataSourceLink = parseReferenceLink(columns[1]);
        if (!cityLink || !dataSourceLink || !dataSourceLink.reference.endsWith('-markets')) {
            continue;
        }

        dataSources.push({
            cityName: cityLink.label,
            url: linkDefinitions.get(dataSourceLink.reference)
        });
    }

    return dataSources;
}

function readCityDataSources() {
    const cities = Object.values(JSON.parse(fs.readFileSync('cities/cities.json', 'utf8')));
    return cities.map(city => {
        const cityData = JSON.parse(fs.readFileSync(`cities/${city.id}.json`, 'utf8'));
        return {
            cityName: city.label,
            url: cityData.metadata.data_source.url
        };
    });
}
