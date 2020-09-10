import { buildFilterConfigData } from '../index';
import * as fixtures from 'modules/__fixtures__/filterConfig.fixture';
import * as wrongFixtures from 'modules/__fixtures__/wrongFilterConfig.fixture';

describe('buildFilterConfigData', () => {
	test('it should return Right(filterConfigData) if the config is valid', () => {
		expect(
            buildFilterConfigData(fixtures.filterConfig)(fixtures.filtersIdsApplied)
                .isRight()
        ).toBe(true);
    });

    test('it should return Left(string) if the config is invalid', () => {
		expect(
            buildFilterConfigData(wrongFixtures.emptyFilterConfig)(fixtures.filtersIdsApplied)
                .isLeft()
        ).toBe(true);
    });
});