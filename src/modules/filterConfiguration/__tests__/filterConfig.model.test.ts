import { buildFilterConfigData } from '../filterConfig.model';
import { getFiltersIdsAppliedFixture, getFilterDictionaryFixture, getFilterConfigFixture } from './__fixtures__/fixtures'

describe('buildFilterConfigData', function(){
    const filterConfigData = buildFilterConfigData(getFilterConfigFixture())(getFiltersIdsAppliedFixture());
    
	test('it should return a dictionary of all filters', () => {
		expect(filterConfigData.getFilterDictionary()).toEqual(getFilterDictionaryFixture());
    });

    test('it should return all the filter ids', () => {
        expect(filterConfigData.getAllFilterIds()).toMatchSnapshot();
    });

    test('it should return all the filter group ids', () => {
        expect(filterConfigData.getAllFilterGroupIds()).toMatchSnapshot();
    });

    test('it should return only the filter ids applied', () => {
        expect(filterConfigData.getFilterIdsApplied()).toEqual(getFiltersIdsAppliedFixture());
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
        expect(filterConfigData.getGroupDictionary()).toMatchSnapshot();
    });

    Object.keys(getFilterDictionaryFixture()).forEach(filterId => {
        test(`it should return the filterGroupId associated to the filter ${filterId}`, () => {
            expect(filterConfigData.getGroupIdForFilter(filterId)).toMatchSnapshot();
        }); 
    });
});