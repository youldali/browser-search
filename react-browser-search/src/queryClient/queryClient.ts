import * as BS from 'browser-search';
import { buildQueryCache } from './queryCache';
import { buildNotifier } from './notifier';

export const buildQueryClient = () => {
  const cache = buildQueryCache();
  const notifier = buildNotifier();

  const mutateStore = <T>(mutationFunction: (storeId: BS.StoreId) => Promise<T>) => (storeId: BS.StoreId): Promise<T> => (
    mutationFunction(storeId)
      .then(result => {
        cache.emptyCacheForStore(storeId)
        notifier.notifyStoreChange(storeId);
        return result;
      })
  )


  const queryStore = <T>(request: BS.Request<T>): [Promise<BS.SearchResponse<T>>, BS.AbortSearch] => {
    const maybeCachedSearchResponse = cache.queryCache(request);

    return (
      maybeCachedSearchResponse.caseOf({
        Just: searchResponse => [Promise.resolve(searchResponse), () => {}],
        Nothing: () => {
          const [searchResponsePromise, abort] = BS.searchStore(request);
          return (
            [
              searchResponsePromise
                .then(searchResponse => {
                  cache.addSearchResponseToCache(request, searchResponse);
                  return searchResponse;
                }),
              abort
            ]
          );
        }
      })
    )
  }

  const createStore = BS.createStore;

  const deleteStore = mutateStore(BS.deleteStore);

  const addDataToStore = <T>(storeId: BS.StoreId) => (data: T[]) => mutateStore((storeId: BS.StoreId) => BS.addDocumentsToStore<T>(storeId)(data))(storeId);

  const subscribeToStoreChange = notifier.addStoreListener;

  const unsubscribeToStoreChange = notifier.removeStoreListener;

  return {
    queryStore,
    createStore,
    deleteStore,
    addDataToStore,
    subscribeToStoreChange,
    unsubscribeToStoreChange,
  }
}


 