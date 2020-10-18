import { reverse } from 'rambda';

//eslint-disable-next-line
const globalScope = typeof window !== "undefined" ? window : self;
const {indexedDB, IDBKeyRange} = globalScope;

type OnUpgradeCallback = (db: IDBDatabase) => void
export type IndexValue = { multiEntry?: boolean, unique?: boolean };
export type IndexConfig = Dictionary<IndexValue>;

export const closeDatabase = (db: IDBDatabase): Promise<void>  => (Promise.resolve(db.close()))

export const openDatabaseLatestVersion = (dbName: string): Promise<IDBDatabase>  => {
    const openDBRequest = indexedDB.open(dbName);

    return new Promise((resolve, reject) => {
        openDBRequest.onerror = () => reject(`error opening DB ${dbName}: ${openDBRequest.error}`);
        openDBRequest.onsuccess = () => resolve(openDBRequest.result);
    });
}

export const createOrOpenDatabase = 
(dbName: string) => 
(dbVersion: number) => 
(onUpgradeCallback: OnUpgradeCallback): Promise<IDBDatabase> => {
    const openDBRequest = indexedDB.open(dbName, dbVersion);

    return new Promise((resolve, reject) => {
        openDBRequest.onerror = () => reject(`error opening DB ${dbName}: ${openDBRequest.error}`);
        openDBRequest.onsuccess = () => resolve(openDBRequest.result);
        openDBRequest.onupgradeneeded = () => onUpgradeCallback(openDBRequest.result);
    });
}

export const upgradeDatabase = 
(dbName: string) => 
async (createObjectStore: OnUpgradeCallback): Promise<IDBDatabase> => {
    const db = await openDatabaseLatestVersion(dbName);
    const latestVersion = db.version;
    db.close();

    return createOrOpenDatabase(dbName)(latestVersion + 1)(createObjectStore);
}

export const createObjectStore = 
(storeName: string) =>
(indexConfig: IndexConfig) => 
(keyPath: string) => 
(db: IDBDatabase) => {
    const objectStore = db.createObjectStore(storeName, { keyPath });
    Object.entries(indexConfig)
        .forEach( ([indexName, indexConfig]) => objectStore.createIndex(indexName, indexName, indexConfig || {}) );
}

export const deleteObjectStore = 
(storeName: string) =>
(db: IDBDatabase) => {
    if(doesStoreExist(storeName)(db)) {
        try {
            db.deleteObjectStore(storeName);
            return db;
        }
        catch (exception) {
            throw (`Couldn't delete object store ${storeName}: ${exception}`)
        }
    }
    return db;
}

export const doesStoreExist = 
(storeName: string) =>
(db: IDBDatabase): boolean => (db.objectStoreNames.contains(storeName));


export const getNumberOfItemsInStore = 
(storeName: string) =>
(db: IDBDatabase): Promise<number> => {
    const 
        transaction = db.transaction([storeName], 'readonly'),
        objectStore = transaction.objectStore(storeName),
        countRequest = objectStore.count();

    return new Promise((resolve, reject) => {
        countRequest.onsuccess = () => resolve(countRequest.result);
        countRequest.onerror = () => reject('error fetching data: ' + countRequest?.error?.message);
    });
}


export const addDataToStore = 
(storeName: string) =>
(db: IDBDatabase) =>
(data: Object[]): Promise<IDBDatabase> => {
    if(!doesStoreExist(storeName)(db)){
        Promise.reject(`Store ${storeName} does not exist !`);
    }

    const 
        transaction = db.transaction([storeName], "readwrite"),
        objectStore = transaction.objectStore(storeName);
    
    data.forEach( row => objectStore.add(row) );
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve(db);
        transaction.onerror = () => reject(`error inserting data for store ${storeName}:`);
    });
};


export const getPrimaryKeysMatchingRange = 
(db: IDBDatabase) => 
(storeName: string) => 
(indexName: string) => 
(keyRange: IDBKeyRange): Promise<unknown[]> => {
    const 
        transaction = db.transaction(storeName, 'readonly'),
        objectStore = transaction.objectStore(storeName),
        index = objectStore.index(indexName),
        request: IDBRequest = index.getAllKeys(keyRange);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(keyRange.lower === keyRange.upper ? request.result : request.result.sort());
        request.onerror = () => reject('error fetching data: ' + request?.error?.message);
    });
};


export const iterateOverStore = 
(storeName: string) => 
(db: IDBDatabase) => 
(callBack: Function): Promise<IDBDatabase> => {
    const 
        transaction = db.transaction(storeName, 'readonly'),
        objectStore = transaction.objectStore(storeName),
        request: IDBRequest = objectStore.openCursor();

    request.onsuccess = event => {
        const cursor: IDBCursorWithValue = (event.target as IDBRequest).result;
        if(cursor) {
            callBack(cursor.primaryKey, cursor.value);
            cursor.continue();
        }
    };

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve(db);
        transaction.onerror = () => reject('error fetching data: ' + transaction?.error?.message);
    });
};


export const getAllUniqueKeysForIndex = 
(db: IDBDatabase) => 
(storeName: string) =>
(indexName: string) => {
    const 
        transaction = db.transaction(storeName, 'readonly'),
        objectStore = transaction.objectStore(storeName),
        index = objectStore.index(indexName),
        request = index.openKeyCursor(null, 'nextunique');

    const keyList: Array<unknown> = [];
    request.onsuccess = event => {
        const cursor = (event.target as IDBRequest).result;
        if(cursor) {
            keyList.push(cursor.key);
            cursor.continue();
        }
    };

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve(keyList);
        transaction.onerror = () => reject('error fetching key list ' + transaction?.error?.message);
    });
};


export const getAllPrimaryKeysForIndex = 
(db: IDBDatabase) => 
(storeName: string) => 
(indexName: string) => 
(reverseDirection: boolean): Promise<unknown[]> => {
    const 
        transaction = db.transaction(storeName, 'readonly'),
        objectStore = transaction.objectStore(storeName),
        index = objectStore.index(indexName),
        request = index.getAllKeys();

    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve( reverseDirection ? reverse(request.result) : request.result );
        request.onerror = () => reject('error fetching data: ' + request?.error?.message);
    });
};


export const getItemList = 
(db: IDBDatabase) => 
(storeName: string) => 
(idList: number[]): Promise<any> => {
    const 
        transaction = db.transaction(storeName, 'readonly'),
        objectStore = transaction.objectStore(storeName),
        itemList: Array<unknown> = [];

    idList.forEach( id => {
        const request = objectStore.get(id);
        request.onsuccess = () => itemList.push(request.result);
    });

    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve(itemList);
        transaction.onerror = () => reject('error fetching the items ' + transaction?.error?.message);
    });
};