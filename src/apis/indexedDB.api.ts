import { reverse } from 'ramda';

//eslint-disable-next-line
const globalScope = typeof window !== "undefined" ? window : self;
const { indexedDB } = globalScope;

type OnUpgradeCallback = (db: IDBDatabase) => void
export type IndexValue = { multiEntry?: boolean, unique?: boolean };
export type IndexConfig = Dictionary<IndexValue>;

export const closeDatabase = (db: IDBDatabase): Promise<void> => Promise.resolve(db.close())

export const openDatabaseLatestVersion = (dbName: string): Promise<IDBDatabase>  => {
    const openDBRequest = indexedDB.open(dbName);

    return new Promise((resolve, reject) => {
        openDBRequest.onerror = () => reject(new Error(`An error occured when opening Database ${dbName}: ${openDBRequest.error}`));
        openDBRequest.onsuccess = () => resolve(openDBRequest.result);
    });
}

export const createOrOpenDatabase = 
(dbName: string) => 
(dbVersion: number) => 
(onUpgradeCallback: OnUpgradeCallback): Promise<IDBDatabase> => {
    const openDBRequest = indexedDB.open(dbName, dbVersion);

    return new Promise((resolve, reject) => {
        openDBRequest.onerror = () => reject(new Error(`An error occured when opening Database ${dbName}: ${openDBRequest.error}`));
        openDBRequest.onsuccess = () => resolve(openDBRequest.result);
        openDBRequest.onupgradeneeded = () => onUpgradeCallback(openDBRequest.result);
    });
}

export const upgradeDatabase = 
(dbName: string) => 
async (onUpgradeCallback: OnUpgradeCallback): Promise<IDBDatabase> => {
    const db = await openDatabaseLatestVersion(dbName);
    const latestVersion = db.version;
    db.close();

    return createOrOpenDatabase(dbName)(latestVersion + 1)(onUpgradeCallback);
}

export const createObjectStore = 
(dbName: string) =>
(storeName: string) =>
(indexConfig: IndexConfig) => 
(keyPath: string): Promise<IDBDatabase> => (
    upgradeDatabase(dbName)(db => {
        const objectStore = db.createObjectStore(storeName, { keyPath });
        Object.entries(indexConfig)
        .forEach( ([indexName, indexConfig]) => objectStore.createIndex(indexName, indexName, indexConfig || {}) );
    })
)

export const deleteObjectStoreIfExist = 
(dbName: string) =>
async (storeName: string): Promise<void> => {
    const db = await openDatabaseLatestVersion(dbName);
    const storeExist = doesStoreExist(db)(storeName);
    await closeDatabase(db);

    if(storeExist) {
        await deleteObjectStore(storeName)(dbName);
    }
}

export const deleteObjectStore = 
(dbName: string) =>
(storeName: string): Promise<void> => (
    upgradeDatabase(dbName)((db) => db.deleteObjectStore(storeName))
    .catch(exception => { throw (new Error(`An error occured when deleting store ${storeName}: ${exception}`)) } )
    .then(closeDatabase)
)

export const doesStoreExist = 
(db: IDBDatabase) =>
(storeName: string): boolean => (db.objectStoreNames.contains(storeName));


export const getNumberOfItemsInStore = 
(db: IDBDatabase) =>
(storeName: string): Promise<number> => {
    const 
        transaction = db.transaction([storeName], 'readonly'),
        objectStore = transaction.objectStore(storeName),
        countRequest = objectStore.count();

    return new Promise((resolve, reject) => {
        countRequest.onsuccess = () => resolve(countRequest.result);
        countRequest.onerror = () => reject(new Error('An error occured when getting the number of items: ' + transaction?.error?.message));
    });
}


export const addDataToStore = 
<T>
(db: IDBDatabase) =>
(storeName: string) =>
(data: T[]): Promise<IDBDatabase> => {
    if(!doesStoreExist(db)(storeName)){
        Promise.reject(new Error(`Error when adding data to store: Store "${storeName}" does not exist !`));
    }

    const 
        transaction = db.transaction([storeName], "readwrite"),
        objectStore = transaction.objectStore(storeName);
    
    data.forEach( row => objectStore.add(row) );
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve(db);
        transaction.onerror = () => reject(new Error(`An error occured when inserting data for store ${storeName}: ${transaction?.error?.message}`));
    });
};


export const getPrimaryKeysMatchingRange = 
(db: IDBDatabase) => 
(storeName: string) => 
(indexName: string) => 
(keyRange: IDBKeyRange): Promise<IDBValidKey[]> => {
    const 
        transaction = db.transaction(storeName, 'readonly'),
        objectStore = transaction.objectStore(storeName),
        index = objectStore.index(indexName),
        request = index.getAllKeys(keyRange);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(keyRange.lower === keyRange.upper ? request.result : request.result.sort());
        request.onerror = () => reject(new Error(`An error occured when getting the primary keys from store "${storeName}": ${transaction?.error?.message}`));
    });
};


type  IteratorOnStoreCallback<T> = (itemKey: IDBValidKey, item: T) => void;
export const iterateOverStore = 
<T>
(db: IDBDatabase) =>
(storeName: string) => 
(callBack: IteratorOnStoreCallback<T>): Promise<IDBDatabase> => {
    const 
        transaction = db.transaction(storeName, 'readonly'),
        objectStore = transaction.objectStore(storeName),
        request = objectStore.openCursor();

    request.onsuccess = event => {
        const cursor: IDBCursorWithValue = (event.target as IDBRequest).result;
        if(cursor) {
            callBack(cursor.primaryKey, cursor.value);
            cursor.continue();
        }
    };

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve(db);
        transaction.onerror = () => reject(new Error(`An error occured when getting the data from the store "${storeName}": ${transaction?.error?.message}`));
    });
};


export const getAllUniqueKeysForIndex = 
(db: IDBDatabase) => 
(storeName: string) =>
(indexName: string): Promise<IDBValidKey[]> => {
    const 
        transaction = db.transaction(storeName, 'readonly'),
        objectStore = transaction.objectStore(storeName),
        index = objectStore.index(indexName),
        request = index.openKeyCursor(null, 'nextunique');

    const keyList: IDBValidKey[] = [];
    request.onsuccess = event => {
        const cursor = (event.target as IDBRequest).result;
        if(cursor) {
            keyList.push(cursor.key);
            cursor.continue();
        }
    };

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve(keyList);
        transaction.onerror = () => reject(new Error(`An error occured when getting the unique keys for store "${storeName}", index "${indexName}":  ${transaction?.error?.message}`));
    });
};


export const getAllPrimaryKeysForIndex = 
(db: IDBDatabase) => 
(storeName: string) => 
(indexName: string) => 
(reverseDirection: boolean): Promise<IDBValidKey[]> => {
    const 
        transaction = db.transaction(storeName, 'readonly'),
        objectStore = transaction.objectStore(storeName),
        index = objectStore.index(indexName),
        request = index.getAllKeys();

    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve( reverseDirection ? reverse(request.result) : request.result );
        request.onerror = () => reject(new Error(`An error occured when getting the primary keys for store "${storeName}", index "${indexName}" :  ${request?.error?.message}`));
    });
};


export const getItems = 
<T>
(db: IDBDatabase) => 
(storeName: string) => 
(itemIds: IDBValidKey[]): Promise<T[]> => {
    const 
        transaction = db.transaction(storeName, 'readonly'),
        objectStore = transaction.objectStore(storeName),
        items: T[] = [];

    itemIds.forEach( id => {
        const request = objectStore.get(id);
        request.onsuccess = () => items.push(request.result);
    });

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve(items);
        transaction.onerror = () => reject(new Error(`An error occured when getting the items of store "${storeName}": ${transaction?.error?.message}`));
    });
};

export const deleteDatabase = 
(dbName: string): Promise<void> => {
    const databaseDeleteRequest = indexedDB.deleteDatabase(dbName);

    return new Promise((resolve, reject) => {
        databaseDeleteRequest.onsuccess = () => resolve();
        databaseDeleteRequest.onerror = () => reject(new Error(`An error occured when deleting database ${dbName}: ${databaseDeleteRequest.error}`));
    });
};

