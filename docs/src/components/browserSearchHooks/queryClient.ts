import * as BS from 'browser-search';
import { buildQueryCache } from './queryCache';

export const buildQueryClient = () => {
  const cache = buildQueryCache();

  const queryStore = <T>(request: BS.Request<T>) => {
    const maybeCachedSearchResponse = cache.queryCache(request);

    return (
      maybeCachedSearchResponse.caseOf({
        Just: Promise.resolve,
        Nothing: () => {
          const [searchResponsePromise] = BS.searchStore(request);
          return (
            searchResponsePromise
              .then(searchResponse => {
                cache.addSearchResponseToCache(request, searchResponse);
                return searchResponse;
              })
          );
        }
      })
    )
  }

  const deleteStore = (storeId: BS.StoreId): Promise<void> => (
    BS.deleteStore(storeId)
      .then(() => {
        cache.emptyCacheForStore(storeId)
      })
  )

  return {
    queryStore,
    deleteStore,
  }
}


 