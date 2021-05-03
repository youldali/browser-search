import { 
    buildFilterConfigDataFromFilterConfig, 
    Filter, 
    FilterConfig,
} from 'modules/filterConfiguration';
import { 
    FilterFunctionsCollections,
    GroupIdToFilterFunctions,
    FilterFunctionsToGroupId,
  } from '../../filteringFunctions.model';

import { operatorToFunction } from 'modules/filterConfiguration';

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
    priceMin: { id: 'priceMin', field: 'price', operator: 'gt', operand: 200 },
    priceMax: { id: 'priceMax', field: 'price', operator: 'lt', operand: 500 },
    numberOfPeople: { id: 'numberOfPeople', field: 'numberOfPeople', operator: 'equals', operand: 2 },
    "activity-1": { id: 'activity-1', field: 'activity', operator: 'contains', operand: 'swimming' },
    "activity-2": { id: 'activity-2', field: 'activity', operator: 'contains', operand: 'tennis' },
    "activity-3": { id: 'activity-3', field: 'activity', operator: 'contains', operand: 'golfing' },
};

export const filterConfigFixture: FilterConfig<Item> = [
    [filterDictionaryFixture.priceMin],
    [filterDictionaryFixture.priceMax],
    [filterDictionaryFixture.numberOfPeople],
    [filterDictionaryFixture['activity-1'], filterDictionaryFixture['activity-2'], filterDictionaryFixture['activity-3']]
];

export const filtersIdsAppliedFixture = ['activity-1', 'priceMin', 'activity-2'];
export const filterConfigDataFixture = buildFilterConfigDataFromFilterConfig<Item>(filterConfigFixture)(filtersIdsAppliedFixture);

const priceMinFilterFunction = (target: Item) => 
  operatorToFunction[filterDictionaryFixture.priceMin.operator](target?.[filterDictionaryFixture.priceMin.field], filterDictionaryFixture.priceMin.operand);

const activity1FilterFunction = (target: Item) => 
  operatorToFunction[filterDictionaryFixture['activity-1'].operator](target?.[filterDictionaryFixture['activity-1'].field], filterDictionaryFixture['activity-1'].operand);

const activity2FilterFunction = (target: Item) => 
  operatorToFunction[filterDictionaryFixture['activity-2'].operator](target?.[filterDictionaryFixture['activity-2'].field], filterDictionaryFixture['activity-2'].operand);

export const filterFunctionsCollectionsFixture: FilterFunctionsCollections<Item> = [
  [priceMinFilterFunction],
  [activity1FilterFunction, activity2FilterFunction]
];

export const filterGroupToFilterFunctionsFixture: GroupIdToFilterFunctions<Item> = {
  '0': filterFunctionsCollectionsFixture[0],
  '3': filterFunctionsCollectionsFixture[1],
}

export const filterFunctionsToFilterGroupFixture: FilterFunctionsToGroupId<Item> = new Map([
  [filterFunctionsCollectionsFixture[0], '0'],
  [filterFunctionsCollectionsFixture[1], '3'],
]);