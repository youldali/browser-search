export { 
  FiltersApplied,
  FilterConfig,
} from '../modules/filterConfiguration'
import * as hash from 'object-hash';
import * as storage from '../apis/storage.util';
import { EitherAsync } from 'purify-ts/EitherAsync'

const storeName = '__cache__';

export const set = (object: object, value: any): EitherAsync<Error, void> => {
  const key = hashObject(object);
  return storage.addDocumentsToStore(storeName)([{key, value}]);
}

export const get = <T>(object: object): EitherAsync<Error, T[]> => {
  const key = hashObject(object);
  return storage.getDocuments<T>(storeName)([key]);
}

const hashObject = (object: object): string => hash(object, {algorithm: 'md5', unorderedArrays: true})