import { pick } from 'ramda';
import { EitherAsync } from 'purify-ts/EitherAsync';

import { get, set } from '../apis/cache';
import {
    deserialize,
    FilteringData,
    serialize,
    SerializedFilteringData,
} from '../modules/filteringData';
import { FilterConfigData } from '../modules/filterConfiguration';

import { QueryRequest } from './models/';

type FilteringDataCacheKey<T> = Pick<QueryRequest<T>, 'storeId' | 'filterConfig' | 'filtersApplied'>

const getFilteringDataCacheKeyFromRequest = <T>(request: QueryRequest<T>): FilteringDataCacheKey<T> => (
  pick(['storeId', 'filterConfig', 'filtersApplied'], request)
)

export const setCachedFilteringData = 
<T>(request: QueryRequest<T>) => 
(filterConfigData: FilterConfigData<T>) => 
(filteringData: FilteringData): EitherAsync<Error, void> => {
  const filteringDataCacheKey = getFilteringDataCacheKeyFromRequest(request);
  return set(filteringDataCacheKey, serialize(filterConfigData)(filteringData));
}

export const getCachedFilteringData = <T>(request: QueryRequest<T>): EitherAsync<Error, FilteringData> => {
  const filteringDataCacheKey = getFilteringDataCacheKeyFromRequest(request);
  return (
    get<SerializedFilteringData>(filteringDataCacheKey)
      .map(deserialize)
  )
}