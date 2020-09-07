import { buildFilterConfigData } from '../index';
import * as fixtures from '../__fixtures__/filterConfig'

describe('buildFilterConfigData', () => {
	test('it should return Right(filterConfigData) if the config is valid', () => {
		expect(buildFilterConfigData(fixtures.validFilterConfig)(['priceMin']).isRight()).toBe(true);
    });

    test('it should return Left(string) if the config is invalid', () => {
		expect(buildFilterConfigData(fixtures.emptyFilterConfig)(['priceMin']).isLeft()).toBe(true);
    });
});