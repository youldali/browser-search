import * as BS from 'browser-search';

import { buildQueryCache } from './queryCache';
import { buildSubscriber } from './subscriber';

export const buildQueryClient = () => {
  const cache = buildQueryCache();
  const subscriber = buildSubscriber();

  const mutateStore = <T>(mutationFunction: (storeId: BS.StoreId) => Promise<T>) => (storeId: BS.StoreId): Promise<T> => (
    mutationFunction(storeId)
      .then(result => {
        cache.deleteStoreCache(storeId)
        subscriber.notifyStoreChange(storeId);
        return result;
      })
  )


  const queryStore = <Document>(request: BS.Request<Document>): [Promise<BS.SearchResponse<Document>>, BS.AbortSearch] => {
    const maybeCachedSearchResponsePromise = cache.queryCache<Document>(request);

    return (
      maybeCachedSearchResponsePromise.caseOf({
        Just: searchResponse => [searchResponse, () => {}],
        Nothing: () => {
          const [searchResponsePromise, abort] = BS.searchStore(request);
          cache.addQueryToCache<Document>(request, searchResponsePromise);
          return [searchResponsePromise, abort];
        }
      })
    )
  }

  const createStore = BS.createStore;

  const deleteStore = mutateStore(BS.deleteStore);

  const addDataToStore = <Document>(storeId: BS.StoreId) => (data: Document[]) => mutateStore((storeId: BS.StoreId) => BS.addDocumentsToStore<Document>(storeId)(data))(storeId);

  const subscribeToStoreChange = subscriber.addStoreListener;

  const unsubscribeToStoreChange = subscriber.removeStoreListener;

  return {
    queryStore,
    createStore,
    deleteStore,
    addDataToStore,
    subscribeToStoreChange,
    unsubscribeToStoreChange,
  }
}


 