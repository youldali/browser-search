import { AbortSearch, Request, SearchResponse, StoreId } from 'browser-search';

import { buildQueryCache } from '../queryCache';
import { buildSubscriber } from '../subscriber';

export const buildQueryClient = () => {
  const cache = buildQueryCache();
  const subscriber = buildSubscriber();

  const mutateStore = <T>(mutationFunction: (storeId: StoreId) => Promise<T>) => (storeId: StoreId): Promise<T> => (
    mutationFunction(storeId)
      .then(result => {
        cache.deleteStoreCache(storeId)
        subscriber.notifyStoreChange(storeId);
        return result;
      })
  )


  const queryStore = <Document>(request: Request<Document>): [Promise<SearchResponse<Document>>, AbortSearch] => {
    const maybeCachedSearchResponsePromise = cache.queryCache<Document>(request);

    const response: SearchResponse<Document, string> = {
      documents: [] as Document[],
      stats: {},
      numberOfDocuments: 0,  
      _cacheStatus_: "none",
    }
    
    return (
      maybeCachedSearchResponsePromise.caseOf({
        Just: searchResponse => [searchResponse, () => {}],
        Nothing: () => {
          const [searchResponsePromise, abort] = [Promise.resolve(response), jest.fn()];
          cache.addQueryToCache<Document>(request, searchResponsePromise);
          return [searchResponsePromise, abort];
        }
      })
    )
  }

  const createStore = jest.fn(() => Promise.resolve());

  const deleteStore = mutateStore(jest.fn(() => Promise.resolve()));

  const addDataToStore = <Document>(storeId: StoreId) => (data: Document[]) => mutateStore(jest.fn(() => Promise.resolve()))(storeId);

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


 