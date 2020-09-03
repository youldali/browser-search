import { createFilterDataBuilder } from '../filter.model';
import { filterFunctionCollectionFixture } from '../__fixtures__/filter.fixture';

describe('createFilterDataBuilder', () => {
    const filterDataBuilder = createFilterDataBuilder();
    filterDataBuilder
            .addFilterFunction(filterFunctionCollectionFixture[0])
            .addFilterFunction(filterFunctionCollectionFixture[1], 'groupA')
            .addFilterFunction(filterFunctionCollectionFixture[2], 'groupA')
            .addFilterFunction(filterFunctionCollectionFixture[3], 'groupB')

    const filterData = filterDataBuilder.getFilteringData();

	test('Should return a sorted FiltersFunctionCollection (1st: no group, 2nd: group by number of filter functions', () => {
        const expectedFilterFunctionsCollection = [
            [filterFunctionCollectionFixture[0]],
            [filterFunctionCollectionFixture[3]],
            [filterFunctionCollectionFixture[1], filterFunctionCollectionFixture[2]]
        ];

        expect(filterData.getFilterFunctionsCollection()).toEqual(expectedFilterFunctionsCollection);
    });

    test('Should return the filterFunctions associated to a group', () => {
        const expectedFilterFunctionsGroupA = [
            filterFunctionCollectionFixture[1],
            filterFunctionCollectionFixture[2],
        ];

        expect(filterData.getFilterFunctionsFromFilterGroup('groupA')).toEqual(expectedFilterFunctionsGroupA);
    });

    test('Should return the group matching a filterFunctionCollection', () => {
        const filterCollectionGroupA = filterData.getFilterFunctionsFromFilterGroup('groupA');
        expect(filterData.getFilterGroupFromFilterFunctions(filterCollectionGroupA)).toEqual('groupA');
    });

});