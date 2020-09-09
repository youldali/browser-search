import { getFilteringData } from '../filter.model';
import * as fixtures from 'modules/filterConfiguration/__fixtures__/filterConfig.fixture';

describe('getFilteringData', () => {
    const filterData = getFilteringData(fixtures.filterConfigData);
    const filterFunctionsCollection = filterData.getFilterFunctionsCollection();

	test('Should return a sorted FiltersFunctionCollection by group length (number of filtering function per group)', () => {
        for (let i = 0; i < filterFunctionsCollection.length; i++) {
            expect(filterFunctionsCollection[i].length).toBe(fixtures.filterFunctionsCollection[i].length);
        }
    });

    test('the filter functions returned should properly filter data', () => {
        const allFilterFunctions = filterFunctionsCollection.flat();
        const fixtureAllFilterFunctions = fixtures.filterFunctionsCollection.flat();

        fixtures.sampleData.forEach (data => {
            allFilterFunctions.forEach( (filterFunction, index) => {
                expect(filterFunction(data)).toBe(fixtureAllFilterFunctions[index](data));
            });
        })
    });

    test('returns the filter functions associated to a group', () => {
        const groupIds = Object.keys(fixtures.filterGroupToFilterFunctions);

        groupIds.forEach (groupId => {
            expect(filterData.getFilterFunctionsFromFilterGroup(groupId)?.length)
                .toBe(fixtures.filterGroupToFilterFunctions[groupId].length)
        })
    });

    test('returns the filter group associated to a filterFunctions list', () => {
        for (let i = 0; i < filterFunctionsCollection.length; i++) {
            const filterFunctions = filterFunctionsCollection[i];
            const fixtureFilterFunctions = fixtures.filterFunctionsCollection[i];

            expect(filterData.getFilterGroupFromFilterFunctions(filterFunctions))
                .toBe(fixtures.filterFunctionsToFilterGroup.get(fixtureFilterFunctions));
        }
    });
});
