import * as idb from './indexedDB.api'
import { map } from 'rambda'
import { Either } from 'purify-ts/Either';
import { EitherAsync, liftPromise, liftEither } from 'purify-ts/EitherAsync'
import { logEithers } from './purifyLogger'
import { isNil } from 'rambda';
import { Operators } from 'modules/filterConfiguration/operators';

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

const openDatabase = (): EitherAsync<Error, IDBDatabase> => (
    liftPromise(() => idb.openDatabaseLatestVersion(databaseId))
);

const closeDatabase = (db: IDBDatabase): EitherAsync<Error, void> => (
    liftPromise(() => idb.closeDatabase(db))
);

type IDBCommand = (db: IDBDatabase) => EitherAsync<Error, any>;
const execute = (...commands: IDBCommand[]): EitherAsync<Error, any> => {
    let dbInstance: IDBDatabase | null = null;

    const openDatabaseCommand = openDatabase()
    .map(db => {
        dbInstance = db;
        return db;
    });

    const commandsToExecute: EitherAsync<Error, unknown> = commands.reduce( (commandsAcc, command) => {
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

    return commandsToExecuteWithDbClosing;
};

export const createStore = 
    (storeName: string) => 
    (simplifiedIndexConfig: SimplifiedIndexConfig) => 
    (keyPath: string): EitherAsync<Error, void> => {
    const indexConfig = simplifiedIndexToIndexConfig(simplifiedIndexConfig)
    const createObjectStore = (database: IDBDatabase) => {
        logEithers(
            Either.encase<Error, void>(() => idb.deleteObjectStore(storeName)(database)),
            Either.encase(() => idb.createObjectStore(storeName)(indexConfig)(keyPath)(database))
        )
    }

    return (
        liftPromise(() => idb.upgradeDatabase(databaseId)(createObjectStore))
        .chain(db => liftPromise(() => idb.closeDatabase(db)))
    )
}

export const addDataToStore = 
(storeName: string) =>
(data: Object[]): EitherAsync<Error, void> => {
    const command: IDBCommand = db => liftPromise(() => idb.addDataToStore(storeName)(db)(data));
    return execute(command);
}

export const iterateOverStore = 
(storeName: string) =>
(callback: (primaryKey: StringOrNumber, item: Object) => void): EitherAsync<Error, void> => {
    const command: IDBCommand = db => liftPromise(() => idb.iterateOverStore(storeName)(db)(callback));
    return execute(command);
}

export const getPrimaryKeysMatchingOperator = 
(storeName: string) => 
(indexName: string) =>
(operator: Operators) =>
(value: any): EitherAsync<Error, StringOrNumber[]> => {
    const eitherKeyRange = Either.encase(() => getKeyRangeMatchingOperator(operator)(value));

    const command: IDBCommand = db => 
        liftEither(eitherKeyRange)
            .chain (keyRange => liftPromise(() => idb.getPrimaryKeysMatchingRange(db)(storeName)(indexName)(keyRange)));

    return execute(command);
}

export const getAllPrimaryKeysForIndex = 
(storeName: string) => 
(indexName: string) => 
(reverseDirection: boolean): EitherAsync<Error, StringOrNumber[]> => {
    const command: IDBCommand = db => liftPromise(() => idb.getAllPrimaryKeysForIndex(db)(storeName)(indexName)(reverseDirection));
    return execute(command);
}

export const getItems = 
(storeName: string) => 
(itemIds: StringOrNumber[]): EitherAsync<Error, Object[]> => {
    const command: IDBCommand = db => liftPromise(() => idb.getItems(db)(storeName)(itemIds));
    return execute(command);
};

export const getKeyRangeMatchingOperator = 
    (operator: Operators) => 
    (value: any): IDBKeyRange  => {
        switch(operator){
            case Operators.equals:
            case Operators.contains:
                return IDBKeyRange.only(value);
            case Operators.lt:
                return IDBKeyRange.upperBound(value, true);
            case Operators.lte:
                return IDBKeyRange.upperBound(value);
            case Operators.gt:
                return IDBKeyRange.lowerBound(value, true);
            case Operators.gte:
                return IDBKeyRange.lowerBound(value);
            case Operators.inRangeClosed:
                return IDBKeyRange.bound(value[0], value[1]);
            case Operators.inRangeOpen:
                return IDBKeyRange.bound(value[0], value[1], true, true);
            case Operators.inRangeOpenClosed:
                return IDBKeyRange.bound(value[0], value[1], true, false);
            case Operators.inRangeClosedOpen:
                return IDBKeyRange.bound(value[0], value[1], false, true);
        }

        throw `No key Range matching this operator '${operator.toString()}' and value '${value.toString()} `;
    }