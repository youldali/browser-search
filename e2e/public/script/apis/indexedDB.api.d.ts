declare type OnUpgradeCallback = (db: IDBDatabase) => void;
export declare type IndexValue = {
    multiEntry?: boolean;
    unique?: boolean;
};
export declare type IndexConfig = Dictionary<IndexValue>;
export declare const closeDatabase: (db: IDBDatabase) => Promise<void>;
export declare const openDatabaseLatestVersion: (dbName: string) => Promise<IDBDatabase>;
export declare const createOrOpenDatabase: (dbName: string) => (dbVersion: number) => (onUpgradeCallback: OnUpgradeCallback) => Promise<IDBDatabase>;
export declare const upgradeDatabase: (dbName: string) => (createObjectStore: OnUpgradeCallback) => Promise<IDBDatabase>;
export declare const createObjectStore: (storeName: string) => (indexConfig: IndexConfig) => (keyPath: string) => (dbName: string) => Promise<IDBDatabase>;
export declare const deleteObjectStoreIfExist: (storeName: string) => (dbName: string) => Promise<void>;
export declare const deleteObjectStore: (storeName: string) => (dbName: string) => Promise<void>;
export declare const doesStoreExist: (storeName: string) => (db: IDBDatabase) => boolean;
export declare const getNumberOfItemsInStore: (storeName: string) => (db: IDBDatabase) => Promise<number>;
export declare const addDataToStore: (storeName: string) => (db: IDBDatabase) => (data: Object[]) => Promise<IDBDatabase>;
export declare const getPrimaryKeysMatchingRange: (db: IDBDatabase) => (storeName: string) => (indexName: string) => (keyRange: IDBKeyRange) => Promise<unknown[]>;
export declare const iterateOverStore: (storeName: string) => (db: IDBDatabase) => (callBack: Function) => Promise<IDBDatabase>;
export declare const getAllUniqueKeysForIndex: (db: IDBDatabase) => (storeName: string) => (indexName: string) => Promise<unknown>;
export declare const getAllPrimaryKeysForIndex: (db: IDBDatabase) => (storeName: string) => (indexName: string) => (reverseDirection: boolean) => Promise<IDBValidKey[]>;
export declare const getItems: (db: IDBDatabase) => (storeName: string) => (itemIds: StringOrNumber[]) => Promise<any>;
export declare const deleteDatabase: (dbName: string) => Promise<void>;
export {};
