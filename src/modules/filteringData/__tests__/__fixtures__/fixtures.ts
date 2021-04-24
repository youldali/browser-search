import { 
    buildFilterConfigDataFromFilterConfig, 
    Filter, 
    FilterConfig,
    Operators,
} from 'modules/filterConfiguration';

import { FilterIdToMatchingItemIds } from '../../filteringData.model'
import { 
  FilteredItemStatus,
  getFilterStatusFromFilterConfig
} from 'modules/filteringStatus';

type ItemActivity = 'swimming' | 'tennis' | 'football' | 'golfing';

export interface Item {
  id: number;
  price: number;
  numberOfPeople: number;
  activity: ItemActivity[];
}

export const itemsFixture: Item[] = [
    { id: 0, price: 250, numberOfPeople: 1, activity: ['swimming', 'tennis']},
    { id: 1, price: 1000, numberOfPeople: 2, activity: ['football', 'swimming', 'tennis', 'golfing']},
    { id: 2, price: 20, numberOfPeople: 5, activity: ['swimming', 'tennis'] },
    { id: 3, price: 1000, numberOfPeople: 1, activity: ['football', 'golfing']},
    { id: 4, price: 10, numberOfPeople: 2, activity: ['football']},
];

export const filterDictionaryFixture: Dictionary<Filter<Item>> = {
    priceMin: { id: 'priceMin', field: 'price', operator: Operators.gt, operand: 200 },
    priceMax: { id: 'priceMax', field: 'price', operator: Operators.lt, operand: 500 },
    numberOfPeople: { id: 'numberOfPeople', field: 'numberOfPeople', operator: Operators.equals, operand: 2 },
    "activity-1": { id: 'activity-1', field: 'activity', operator: Operators.contains, operand: 'swimming' },
    "activity-2": { id: 'activity-2', field: 'activity', operator: Operators.contains, operand: 'tennis' },
    "activity-3": { id: 'activity-3', field: 'activity', operator: Operators.contains, operand: 'golfing' },
};

export const filterConfigFixture: FilterConfig<Item> = [
    [filterDictionaryFixture.priceMin],
    [filterDictionaryFixture.priceMax],
    [filterDictionaryFixture.numberOfPeople],
    [filterDictionaryFixture['activity-1'], filterDictionaryFixture['activity-2'], filterDictionaryFixture['activity-3']]
];

export const filtersIdsAppliedFixture = ['activity-1', 'priceMin', 'activity-2'];
export const filterConfigDataFixture = buildFilterConfigDataFromFilterConfig<Item>(filterConfigFixture)(filtersIdsAppliedFixture);

export const filterIdToMatchingItemIdsFixture: FilterIdToMatchingItemIds = {
  [filterDictionaryFixture.priceMin.id]: [0, 1, 3],
  [filterDictionaryFixture.priceMax.id]: [0, 2, 4],
  [filterDictionaryFixture.numberOfPeople.id]: [1, 4],
  [filterDictionaryFixture['activity-1'].id]: [0, 1, 2],
  [filterDictionaryFixture['activity-2'].id]: [0, 1, 2],
  [filterDictionaryFixture['activity-3'].id]: [1, 3],
}

export const getFilterStatusForItem = getFilterStatusFromFilterConfig(filterConfigDataFixture);

export const itemToFilteringStatusFixture:  Map<any, FilteredItemStatus> = new Map (
  itemsFixture.map( item => [
      item,
      getFilterStatusForItem(item),
  ])
);