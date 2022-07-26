import { isNil } from 'ramda';
import { Either } from 'purify-ts/Either';
import { EitherAsync } from 'purify-ts/EitherAsync';
import { Operator } from 'modules/filterConfiguration/operators';

import * as idb from './indexedDB.api';

const databaseId = "browser-search";
export interface SimplifiedIndexConfig<T> {
    simple?: Array<keyof T>;
    array?: Array<keyof T>;
}

const simplifiedIndexToIndexConfig = <T>(simplifiedIndex: SimplifiedIndexConfig<T>): idb.IndexConfig => {
    const arrayConfig = { multiEntry: true, unique: false };
    const defaultConfig = { multiEntry: false, unique: false };

    const indexConfigSimpleProperties = simplifiedIndex.simple?.reduce((indexConfig: idb.IndexConfig, property: keyof T): idb.IndexConfig => {
        indexConfig[property as string] = defaultConfig;
        return indexConfig;
    }, {});

    const indexConfigArrayProperties = simplifiedIndex.array?.reduce((indexConfig: idb.IndexConfig, property: keyof T): idb.IndexConfig => {
        indexConfig[property as string] = arrayConfig;
        return indexConfig;
    }, {});

    const indexConfig: idb.IndexConfig = {...indexConfigSimpleProperties, ...indexConfigArrayProperties};

    return indexConfig;
}
const openDatabase = (): EitherAsync<Error, IDBDatabase> => (
    EitherAsync(() => idb.openDatabaseLatestVersion(databaseId))
);

const closeDatabase = (db: IDBDatabase): EitherAsync<Error, void> => (
    EitherAsync(() => idb.closeDatabase(db))
);

type IDBCommand = (db: IDBDatabase) => EitherAsync<Error, unknown>;
const execute = <T>(...commands: IDBCommand[]): EitherAsync<Error, T> => {
    let dbInstance: IDBDatabase | null = null;

    const openDatabaseCommand = openDatabase()
    .map(db => {
        dbInstance = db;
        return db;
    });

    const commandsToExecute: EitherAsync<Error, unknown> = commands.reduce( (commandsAcc: EitherAsync<Error, unknown>, command: IDBCommand) => {
        return commandsAcc.chain(() => command(dbInstance as IDBDatabase))
    }, openDatabaseCommand);

    const commandsToExecuteWithDbClosing = 
        commandsToExecute
            .map((result) => {
                closeDatabase(dbInstance as IDBDatabase).run();
                return result;
            })
            .mapLeft(error => {
                !isNil(dbInstance) && closeDatabase(dbInstance).run();
                return error;
            });

    return commandsToExecuteWithDbClosing as EitherAsync<Error, T>;
};

export const createStore = 
    <T>(storeName: string) => 
    (simplifiedIndexConfig: SimplifiedIndexConfig<T>) => 
    (keyPath: keyof T): EitherAsync<Error, void> => {
    const indexConfig = simplifiedIndexToIndexConfig(simplifiedIndexConfig)

    return (
        EitherAsync(() => idb.deleteObjectStoreIfExist(databaseId)(storeName))
        .chain (() => EitherAsync(() => idb.createObjectStore(databaseId)(storeName)(indexConfig)(keyPath as string)))
        .chain(db => EitherAsync(() => idb.closeDatabase(db))) as EitherAsync<Error, void>
    )
}

export const createStoreIfNotExist = 
    <T>
    (storeName: string) => 
    (simplifiedIndexConfig: SimplifiedIndexConfig<T>) => 
    (keyPath: keyof T): EitherAsync<Error, void> => {
    const indexConfig = simplifiedIndexToIndexConfig(simplifiedIndexConfig)

    return (
        EitherAsync(() => idb.createObjectStoreIfNotExist(databaseId)(storeName)(indexConfig)(keyPath as string))
        .chain(db => EitherAsync(() => idb.closeDatabase(db))) as EitherAsync<Error, void>
    )
}

export const deleteStore = (storeName: string): EitherAsync<Error, void> => (
    EitherAsync((() => idb.deleteObjectStore(databaseId)(storeName)))
)

export const deleteStoreIfExist = (storeName: string): EitherAsync<Error, void> => (
    EitherAsync((() => idb.deleteObjectStoreIfExist(databaseId)(storeName)))
)

export const deleteDatabase = (): EitherAsync<Error, void> => (
    EitherAsync((() => idb.deleteDatabase(databaseId)))
)

export const addDocumentsToStore = 
<T>
(storeName: string) =>
(data: T[]): EitherAsync<Error, void> => {
    const command: IDBCommand = db => EitherAsync(() => idb.addDocumentsToStore(db)(storeName)(data));
    return execute(command);
}

export const iterateOverStore = 
<T>
(storeName: string) =>
(callback: (primaryKey: ItemKey, item: T) => void): EitherAsync<Error, void> => {
    const command: IDBCommand = db => EitherAsync(() => idb.iterateOverStore<T, ItemKey>(db)(storeName)(callback));
    return execute(command);
}

export const getPrimaryKeysMatchingOperator = 
(storeName: string) => 
(indexName: string) =>
(operator: Operator) =>
(operand: unknown): EitherAsync<Error, ItemKey[]> => {
    const eitherKeyRange = Either.encase(() => getKeyRangeMatchingOperator(operator)(operand));

    const command: IDBCommand = db => 
        EitherAsync.liftEither(eitherKeyRange)
            .chain (keyRange => EitherAsync(() => idb.getPrimaryKeysMatchingRange(db)(storeName)(indexName)(keyRange)));

    return execute(command) as EitherAsync<Error, ItemKey[]>;
}

export const getAllPrimaryKeysForIndex = 
(storeName: string) => 
(indexName: string) => 
(reverseDirection: boolean): EitherAsync<Error, ItemKey[]> => {
    const command: IDBCommand = db => EitherAsync(() => idb.getAllPrimaryKeysForIndex(db)(storeName)(indexName)(reverseDirection));
    return execute(command);
}

export const getAllUniqueKeysForIndex = 
<K extends IDBValidKey>
(storeName: string) => 
(indexName: string): EitherAsync<Error, K[]> => {
    const command: IDBCommand = db => EitherAsync(() => idb.getAllUniqueKeysForIndex<K>(db)(storeName)(indexName));
    return execute(command);
}


export const getDocuments = 
<T>
(storeName: string) => 
(documentIds: IDBValidKey[]): EitherAsync<Error, T[]> => {
    const command: IDBCommand = db => EitherAsync(() => idb.getDocuments(db)(storeName)(documentIds));
    return execute(command);
};

export const getNumberOfDocumentsInStore = 
(storeName: string) : EitherAsync<Error, number> => {
    const command: IDBCommand = db => EitherAsync(() => idb.getNumberOfDocumentsInStore(db)(storeName));
    return execute(command);
};

export const doesStoreExist = 
(storeName: string) : EitherAsync<Error, boolean> => {
    const command: IDBCommand = db => EitherAsync(() => Promise.resolve(idb.doesStoreExist(db)(storeName)));
    return execute(command);
};

export const getKeyRangeMatchingOperator = 
    (operator: Operator) => 
    (value: any): IDBKeyRange  => {
        switch(operator){
            case 'equals':
            case 'contains':
                return IDBKeyRange.only(value);
            case 'lt':
                return IDBKeyRange.upperBound(value, true);
            case 'lte':
                return IDBKeyRange.upperBound(value);
            case 'gt':
                return IDBKeyRange.lowerBound(value, true);
            case 'gte':
                return IDBKeyRange.lowerBound(value);
            case 'inRangeClosed':
                return IDBKeyRange.bound(value[0], value[1]);
            case 'inRangeOpen':
                return IDBKeyRange.bound(value[0], value[1], true, true);
            case 'inRangeOpenClosed':
                return IDBKeyRange.bound(value[0], value[1], true, false);
            case 'inRangeClosedOpen':
                return IDBKeyRange.bound(value[0], value[1], false, true);
        }

        throw `No key Range matching this operator '${operator.toString()}' and value '${value.toString()} `;
    }