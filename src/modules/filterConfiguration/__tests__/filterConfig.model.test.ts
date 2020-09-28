import { buildFilterConfigData } from '../filterConfig.model';
import * as fixtures from 'modules/__fixtures__/fixtures'

describe('buildFilterConfigData', function(){
    const filterConfigData = buildFilterConfigData(fixtures.filterConfig)(fixtures.filtersIdsApplied);
    
	test('it should return a dictionary of all filters', () => {
		expect(filterConfigData.getFilterDictionary()).toEqual(fixtures.filterDictionary);
    });

    test('it should return all the filter ids', () => {
        expect(filterConfigData.getAllFilterIds()).toMatchSnapshot();
    });

    test('it should return all the filter group ids', () => {
        expect(filterConfigData.getAllFilterGroupIds()).toMatchSnapshot();
    });

    test('it should return only the filter ids applied', () => {
        expect(filterConfigData.getFilterIdsApplied()).toEqual(fixtures.filtersIdsApplied);
    });

    test('it should return only the filter ids not applied', () => {
        expect(filterConfigData.getFilterIdsNotApplied()).toMatchSnapshot();
    });

    test('it should return only the filters applied', () => {
        expect(filterConfigData.getFiltersApplied()).toMatchSnapshot();
    });

    test('it should return only the filters not applied', () => {
        expect(filterConfigData.getFiltersNotApplied()).toMatchSnapshot();
    });

    test('it should return a dictionary of groupOfFilter by key of group', () => {
        expect(filterConfigData.getFiltersByGroup()).toMatchSnapshot();
    });

    Object.keys(fixtures.filterDictionary).forEach(filterId => {
        test(`it should return the filterGroupId associated to the filter ${filterId}`, () => {
            expect(filterConfigData.getGroupIdForFilter(filterId)).toMatchSnapshot();
        }); 
    });
});