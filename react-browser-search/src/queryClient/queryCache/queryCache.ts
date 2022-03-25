import * as BS from 'browser-search';
import hash from 'object-hash';
import { Maybe } from 'purify-ts/Maybe';

import { buildStoreCache } from './storeCache';

type RequestHash = string;

export const buildQueryCache = <Document>() => {
  const responseCache = buildStoreCache<RequestHash, BS.SearchResponse<Document>>();
  const pendingQueryCache = buildStoreCache<RequestHash, Promise<BS.SearchResponse<Document>>>();

  const queryCache = (request: BS.Request<Document>): Maybe<Promise<BS.SearchResponse<Document>>> => {
    const requestHash = hashObject(request);

    return (
      responseCache
        .queryCache(request.storeId, requestHash)
        .map(response => Promise.resolve(response))
        .alt(pendingQueryCache.queryCache(request.storeId, requestHash))
    )
  }

  const addQueryToCache = (request: BS.Request<Document>, query: Promise<BS.SearchResponse<Document>>): void => {
    const requestHash = hashObject(request);
    pendingQueryCache.addValueToStoreCache(request.storeId, requestHash, query);

    query
      .then(queryResponse => {
        responseCache.addValueToStoreCache(request.storeId, requestHash, queryResponse);
      })
      .finally(() => {
        pendingQueryCache.deleteKeyFromStore(request.storeId, requestHash)
      })
  }

  const deleteStoreCache = (storeId: BS.StoreId): void => {
    responseCache.deleteStoreCache(storeId);
    pendingQueryCache.deleteStoreCache(storeId);
  }

  return {
    queryCache,
    addQueryToCache,
    deleteStoreCache,
  }
}

const hashObject = (object: object): string => hash(object, {algorithm: 'md5', unorderedArrays: true})

 