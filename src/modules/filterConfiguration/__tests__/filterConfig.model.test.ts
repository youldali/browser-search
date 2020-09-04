import { buildFilterConfigData } from '../filterConfig.model';
import { validFilterConfig } from '../__fixtures__/filterConfig'

describe('buildFilterConfigData', function(){
    const filtersApplied = ['priceMin', 'activity-1', 'activity-2'];
    const filterConfigData = buildFilterConfigData(validFilterConfig)(filtersApplied);
    
	test('it should return a dictionary of all filters', () => {
		expect(filterConfigData.getFilterDictionary()).toMatchSnapshot();
    });

    test('it should return only the filters applied', () => {
		expect(filterConfigData.getFiltersApplied()).toMatchSnapshot();
    });

    test('it should return a dictionary of groupOfFilter by key of group', () => {
        expect(filterConfigData.getFiltersByGroup()).toMatchSnapshot();
    });
});