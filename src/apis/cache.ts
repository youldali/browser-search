export { 
  FiltersApplied,
  FilterConfig,
} from '../modules/filterConfiguration'
import * as hash from 'object-hash';
import * as storage from '../apis/storage.util';
import { EitherAsync } from 'purify-ts/EitherAsync'
import { Left, Right } from 'purify-ts/Either'

const storeName = '__cache__';

export const set = (keyToHash: object, value: any): EitherAsync<Error, void> => {
  const key = hashObject(keyToHash);

  return (
    createCacheIfNotExist()
      .chain( _ => storage.addDocumentsToStore(storeName)([{key, value}]))
  )
}

export const get = <T>(keyToHash: object): EitherAsync<Error, T> => {
  const key = hashObject(keyToHash);

  return (
    storage
      .getDocuments<T>(storeName)([key])
      .chain(documents => 
        documents.length > 0 
        ? EitherAsync.liftEither(Right(documents[0])) 
        : EitherAsync.liftEither(Left(new Error('Cache miss')))
      )
  );
}

const createCacheIfNotExist = (): EitherAsync<Error, void> => (
  storage
    .createStoreIfNotExist(storeName)({})('key')
    .mapLeft(e => {
      console.log('An error occured when creating the cache: ' + e);
      return e;
    })
)


const hashObject = (object: object): string => hash(object, {algorithm: 'md5', unorderedArrays: true})