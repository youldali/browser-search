import { buildFilterConfigData } from '../index';
import { filterConfigFixture, filtersIdsAppliedFixture } from './__fixtures__/fixtures';
import { emptyFilterConfigFixture } from './__fixtures__/wrongFilterConfig.fixture';

describe('buildFilterConfigData', () => {
	test('it should return Right(filterConfigData) if the config is valid', () => (
        buildFilterConfigData(filterConfigFixture)(filtersIdsAppliedFixture)
        .run()
        .then(eitherFilterConfigData => expect(eitherFilterConfigData.isRight()).toBe(true))
    ));

    test('it should return Left(string) if the config is invalid', () => (
        buildFilterConfigData(emptyFilterConfigFixture)(filtersIdsAppliedFixture)
        .run()
        .then(eitherFilterConfigData => expect(eitherFilterConfigData.isLeft()).toBe(true))
    ));
});