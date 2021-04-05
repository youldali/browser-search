import { buildFilterConfigData } from '../index';
import * as fixtures from 'modules/__fixtures__/fixtures';
import * as wrongFixtures from 'modules/__fixtures__/wrongFilterConfig.fixture';

describe('buildFilterConfigData', () => {
	test('it should return Right(filterConfigData) if the config is valid', () => (
        buildFilterConfigData(fixtures.filterConfig)(fixtures.filtersIdsApplied)
        .run()
        .then(eitherFilterConfigData => expect(eitherFilterConfigData.isRight()).toBe(true))
    ));

    test('it should return Left(string) if the config is invalid', () => (
        buildFilterConfigData(wrongFixtures.emptyFilterConfig)(fixtures.filtersIdsApplied)
        .run()
        .then(eitherFilterConfigData => expect(eitherFilterConfigData.isLeft()).toBe(true))
    ));
});