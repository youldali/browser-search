import { 
  getFilteringFunctionsData, 
} from '../filteringFunctions.model';
import { filterConfigDataFixture, itemsFixture, filterFunctionsCollectionsFixture, filterGroupToFilterFunctionsFixture, filterFunctionsToFilterGroupFixture } from './__fixtures__/fixtures';

describe('getFilteringData', () => {
  const filteringFunctionsData = getFilteringFunctionsData(filterConfigDataFixture);


  test('Should return a sorted FiltersFunctionCollections by group length (number of filtering function per group)', () => {
    const filterFunctionsCollections = filteringFunctionsData.getFilterFunctionsCollections();
    for (let i = 0; i < filterFunctionsCollections.length; i++) {
      expect(filterFunctionsCollections[i].length).toBe(filterFunctionsCollectionsFixture[i].length);
    }
  });

  test('the filter functions returned should properly filter data', () => {
    const filterFunctionsCollections = filteringFunctionsData.getFilterFunctionsCollections();
    const allFilterFunctions = filterFunctionsCollections.flat();
    const allFilterFunctionsFixture = filterFunctionsCollectionsFixture.flat();

    itemsFixture.forEach (item => {
      allFilterFunctions.forEach( (filterFunction, index) => {
        expect(filterFunction(item)).toBe(allFilterFunctionsFixture[index](item));
      });
    })
  });

  test('returns the filter functions associated to a group', () => {
    const groupIds = Object.keys(filterGroupToFilterFunctionsFixture);

    groupIds.forEach (groupId => {
      expect(filteringFunctionsData.getFilterFunctionsFromGroup(groupId)?.length)
        .toBe(filterGroupToFilterFunctionsFixture[groupId].length)
    })
  });

  test('returns the filter group associated to a filterFunctions list', () => {
    const filterFunctionsCollections = filteringFunctionsData.getFilterFunctionsCollections();

    for (let i = 0; i < filterFunctionsCollections.length; i++) {
        const filterFunctions = filterFunctionsCollections[i];
        const fixtureFilterFunctions = filterFunctionsCollectionsFixture[i];

        expect(filteringFunctionsData.getGroupIdFromFilterFunctions(filterFunctions))
          .toBe(filterFunctionsToFilterGroupFixture.get(fixtureFilterFunctions));
    }
  });
});
