import { createFixture } from 'helpers/fixture.util';
import { Filter, FilterConfig } from 'modules/filterConfiguration/filterConfig.model';

import { QueryRequest } from '../../request.model';

type ItemActivity = 'swimming' | 'tennis' | 'football' | 'golfing';

interface Item {
  id: number;
  price: number;
  numberOfPeople: number;
  activity: ItemActivity[];
}

export const filterDictionaryFixture: Record<string, Filter<Item>> = {
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
  
export const getRequestFixture = createFixture<QueryRequest<Item>>({
  storeId: 'items',
  filterConfig: filterConfigFixture,
  filtersApplied: ['priceMin'],
  orderBy: 'price',
  orderDirection: 'ASC',
  perPage: 5,
  page: 0,
});

export const getShortRequestFixture = createFixture<QueryRequest<Item>>({
  storeId: 'items',
  filterConfig: filterConfigFixture,
  filtersApplied: [],
});
