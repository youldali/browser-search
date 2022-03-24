import * as BS from 'browser-search';
import hash from 'object-hash';
import { Maybe } from 'purify-ts/Maybe';

import { buildStoreCache } from './storeCache';

type RequestHash = string;

export const buildQueryCache = <Document>() => {
  const responseCache = buildStoreCache<RequestHash, BS.SearchResponse<Document>>();
  const pendingQueryCache = buildStoreCache<RequestHash, Promise<BS.SearchResponse<Document>>>();

  const queryResponseCache = (request: BS.Request<Document>): Maybe<BS.SearchResponse<Document>> => {
    const requestHash = hashObject(request);
    return responseCache.queryCache(request.storeId, requestHash);
  }

  const queryPendingQueryCache = (request: BS.Request<Document>): Maybe<Promise<BS.SearchResponse<Document>>> => {
    const requestHash = hashObject(request);
    return pendingQueryCache.queryCache(request.storeId, requestHash);
  }

  const addPendingQueryToCache = (request: BS.Request<Document>, pendingQuery: Promise<BS.SearchResponse<Document>>): void => {
    const requestHash = hashObject(request);
    pendingQueryCache.addValueToStoreCache(requestHash, pendingQuery, request.storeId,);
  }

  const addQueryResponseToCache = (request: BS.Request<Document>, queryResponse: BS.SearchResponse<Document>): void => {
    const requestHash = hashObject(request);
    responseCache.addValueToStoreCache(requestHash, queryResponse, request.storeId,);
  }

  return {
    queryResponseCache,
    queryPendingQueryCache,
    addPendingQueryToCache,
    addQueryResponseToCache,
  }
}

const hashObject = (object: object): string => hash(object, {algorithm: 'md5', unorderedArrays: true})

 