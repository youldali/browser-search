import * as idb from './indexedDB.api'
import { map } from 'rambda'
import { Either } from 'purify-ts/Either';
import { EitherAsync, liftEither, liftPromise } from 'purify-ts/EitherAsync'
import { logEithers } from './purifyLogger'

const databaseId = "browser-search";

enum IndexType {
    simple = 'simple',
    array = 'array',
}

interface SimplifiedIndexConfig {
    [key: string]: IndexType;
}

const simplifiedIndexToIndexConfig = (simplifiedIndex: SimplifiedIndexConfig): idb.IndexConfig => {
    const arrayConfig = { multiEntry: true, unique: false };
    const defaultConfig = { multiEntry: false, unique: false };

    return map( 
        (indexType: IndexType) => indexType === IndexType.array ? arrayConfig : defaultConfig,
        (simplifiedIndex)
    );
}

export const createStore = 
    (storeName: string) => 
    (simplifiedIndexConfig: SimplifiedIndexConfig) => 
    (keyPath: string): EitherAsync<Error, IDBDatabase> => {
    const indexConfig = simplifiedIndexToIndexConfig(simplifiedIndexConfig)
    const createObjectStore = (database: IDBDatabase) => {
        logEithers(
            Either.encase<Error, void>(() => idb.deleteObjectStore(storeName)(database)),
            Either.encase(() => idb.createObjectStore(storeName)(indexConfig)(keyPath)(database))
        )
    }
    return liftPromise(() => idb.upgradeDatabase(databaseId)(createObjectStore));
}