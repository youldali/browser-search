import { buildFilterConfigData } from '../filterConfig.model';
import * as fixtures from 'modules/__fixtures__/filterConfig.fixture'

describe('buildFilterConfigData', function(){
    const filterConfigData = buildFilterConfigData(fixtures.filterConfig)(fixtures.filtersIdsApplied);
    
	test('it should return a dictionary of all filters', () => {
		expect(filterConfigData.getFilterDictionary()).toEqual(fixtures.filterDictionary);
    });

    test('it should return only the filters applied', () => {
        expect(filterConfigData.getFiltersApplied()).toEqual(fixtures.filtersApplied);
    });

    test('it should return a dictionary of groupOfFilter by key of group', () => {
        expect(filterConfigData.getFiltersByGroup()).toEqual(fixtures.filterByGroup);
    });

    test('it should return the filterGroupId associated to a filter', () => {
        const filterId_0 = fixtures.filtersIdsApplied[0];
        const filterId_1 = fixtures.filtersIdsApplied[1];

        expect(filterConfigData.getGroupIdForFilter(filterId_0))
            .toBe(fixtures.filterToGroup.get(filterId_0));

        expect(filterConfigData.getGroupIdForFilter(filterId_1))
            .toBe(fixtures.filterToGroup.get(filterId_1));
    });
});