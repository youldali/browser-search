import { get, set } from '../apis/cache';
import { FilteringData, SerializedFilteringData, serialize, deserialize } from '../modules/filteringData';
import { FilterConfigData } from '../modules/filterConfiguration';
import { Request } from './models/';
import { pick } from 'ramda';
import { EitherAsync } from 'purify-ts/EitherAsync'

type FilteringDataCacheKey<T> = Pick<Request<T>, 'storeId' | 'filterConfig' | 'filtersApplied'>

const getFilteringDataCacheKeyFromRequest = <T>(request: Request<T>): FilteringDataCacheKey<T> => (
  pick(['storeId', 'filterConfig', 'filtersApplied'], request)
)

export const setCachedFilteringData = 
<T>(request: Request<T>) => 
(filterConfigData: FilterConfigData<T>) => 
(filteringData: FilteringData): EitherAsync<Error, void> => {
  const filteringDataCacheKey = getFilteringDataCacheKeyFromRequest(request);
  return set(filteringDataCacheKey, serialize(filterConfigData)(filteringData));
}

export const getCachedFilteringData = <T>(request: Request<T>): EitherAsync<Error, FilteringData> => {
  const filteringDataCacheKey = getFilteringDataCacheKeyFromRequest(request);
  return (
    get<SerializedFilteringData>(filteringDataCacheKey)
      .map(deserialize)
  )
}