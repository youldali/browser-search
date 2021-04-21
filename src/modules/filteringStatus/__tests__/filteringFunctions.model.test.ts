import { 
  getFilteringFunctionsData, 
  FilteringFunctionsData,
  FilterFunctionsCollections,
  GroupIdToFilterFunctions,
  FilterFunctionsToGroupId,
} from '../filteringFunctions.model';
import { eitherAsyncFilterConfigDataFixture, itemsFixture, filterDictionaryFixture, Item } from './__fixtures__/fixtures';
import { operatorToFunction, FilterConfigData } from 'modules/filterConfiguration';

const priceMinFilterFunction = (target: Item) => 
  operatorToFunction[filterDictionaryFixture.priceMin.operator](target?.[filterDictionaryFixture.priceMin.field], filterDictionaryFixture.priceMin.operand);

const activity1FilterFunction = (target: Item) => 
  operatorToFunction[filterDictionaryFixture['activity-1'].operator](target?.[filterDictionaryFixture['activity-1'].field], filterDictionaryFixture['activity-1'].operand);

const activity2FilterFunction = (target: Item) => 
  operatorToFunction[filterDictionaryFixture['activity-2'].operator](target?.[filterDictionaryFixture['activity-2'].field], filterDictionaryFixture['activity-2'].operand);

const filterFunctionsCollectionsFixture: FilterFunctionsCollections<Item> = [
  [priceMinFilterFunction],
  [activity1FilterFunction, activity2FilterFunction]
];

const filterGroupToFilterFunctionsFixture: GroupIdToFilterFunctions<Item> = {
  '0': filterFunctionsCollectionsFixture[0],
  '3': filterFunctionsCollectionsFixture[1],
}

const filterFunctionsToFilterGroupFixture: FilterFunctionsToGroupId<Item> = new Map([
  [filterFunctionsCollectionsFixture[0], '0'],
  [filterFunctionsCollectionsFixture[1], '3'],
]);

describe('getFilteringData', () => {
  let filterConfigDataFixture: FilterConfigData<Item>;
  let filteringFunctionsData: FilteringFunctionsData<Item>;

  beforeAll( () => (
    eitherAsyncFilterConfigDataFixture
      .run()
      .then(eitherFilterConfigDataFixture => {
        filterConfigDataFixture = eitherFilterConfigDataFixture.extract() as FilterConfigData<Item>;
        filteringFunctionsData = getFilteringFunctionsData(filterConfigDataFixture);
      })
  ));

  test('Should return a sorted FiltersFunctionCollections by group length (number of filtering function per group)', () => {
    const filterFunctionsCollections = filteringFunctionsData.getFilterFunctionsCollections();
    for (let i = 0; i < filterFunctionsCollections.length; i++) {
      expect(filterFunctionsCollections[i].length).toBe(filterFunctionsCollectionsFixture[i].length);
      expect(filterFunctionsCollections[i].toString()).toMatchSnapshot();
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
