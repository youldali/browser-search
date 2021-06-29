import * as BS from 'browser-search';
import { StoreId } from 'browser-search';
import * as hash from 'object-hash';
import { Maybe, Just, Nothing } from 'purify-ts/Maybe'

type RequestHash = string;

type SearchCache = Map<RequestHash, BS.SearchResponse<unknown>>; // key is hash of Request
type SearchResponseByStoreIndex = Map<BS.StoreId, RequestHash[]>; // key is hash of Request

export const buildQueryCache = () => {
  const searchResponseCache: SearchCache = new Map();
  const searchResponseByStoreIndex: SearchResponseByStoreIndex = new Map();

  const addHashToStoreList = (requestHash: RequestHash, storeId: BS.StoreId): void => {
    const hashes = searchResponseByStoreIndex.get(storeId) ?? [];
    hashes.push(requestHash);
    searchResponseByStoreIndex.set(storeId, hashes);
  }

  const getHashesForStore = (storeId: StoreId): RequestHash[] => (
    searchResponseByStoreIndex.get(storeId) ?? []
  )

  const deletehashesForStore = (storeId: StoreId): void => {
    searchResponseByStoreIndex.delete(storeId);
  }

  const queryCache = <T>(request: BS.Request<T>): Maybe<BS.SearchResponse<T>> => {
    const requestHash = hashObject(request);
    return searchResponseCache.has(requestHash) ? Just(searchResponseCache.get(requestHash) as BS.SearchResponse<T>) : Nothing;
  }

  const addSearchResponseToCache = <T>(request: BS.Request<T>, searchResponse: BS.SearchResponse<T>): void => {
    const requestHash = hashObject(request);
    searchResponseCache.set(requestHash, searchResponse);
    addHashToStoreList(requestHash, request.storeId);
  }

  const emptyCacheForStore = (storeId: StoreId): void => {
    const hashes = getHashesForStore(storeId);
    hashes.forEach(hash => searchResponseCache.delete(hash));
    deletehashesForStore(storeId);
  }

  return {
    addSearchResponseToCache,
    emptyCacheForStore,
    queryCache,
  }
}

const hashObject = (object: object): string => hash(object, {algorithm: 'md5', unorderedArrays: true})

 