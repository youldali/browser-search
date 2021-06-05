declare type OnUpgradeCallback = (db: IDBDatabase) => void;
export declare type IndexValue = {
    multiEntry?: boolean;
    unique?: boolean;
};
export declare type IndexConfig = Dictionary<IndexValue>;
export declare const closeDatabase: (db: IDBDatabase) => Promise<void>;
export declare const openDatabaseLatestVersion: (dbName: string) => Promise<IDBDatabase>;
export declare const createOrOpenDatabase: (dbName: string) => (dbVersion: number) => (onUpgradeCallback: OnUpgradeCallback) => Promise<IDBDatabase>;
export declare const upgradeDatabase: (dbName: string) => (onUpgradeCallback: OnUpgradeCallback) => Promise<IDBDatabase>;
export declare const createObjectStore: (dbName: string) => (storeName: string) => (indexConfig: IndexConfig) => (keyPath: string) => Promise<IDBDatabase>;
export declare const deleteObjectStoreIfExist: (dbName: string) => (storeName: string) => Promise<void>;
export declare const deleteObjectStore: (dbName: string) => (storeName: string) => Promise<void>;
export declare const doesStoreExist: (db: IDBDatabase) => (storeName: string) => boolean;
export declare const getNumberOfDocumentsInStore: (db: IDBDatabase) => (storeName: string) => Promise<number>;
export declare const addDocumentsToStore: <T>(db: IDBDatabase) => (storeName: string) => (data: T[]) => Promise<IDBDatabase>;
export declare const getPrimaryKeysMatchingRange: <K extends IDBValidKey>(db: IDBDatabase) => (storeName: string) => (indexName: string) => (keyRange: IDBKeyRange) => Promise<K[]>;
declare type IteratorOnStoreCallback<T, K extends IDBValidKey> = (itemKey: K, item: T) => void;
export declare const iterateOverStore: <T, K extends IDBValidKey>(db: IDBDatabase) => (storeName: string) => (callBack: IteratorOnStoreCallback<T, K>) => Promise<IDBDatabase>;
export declare const getAllUniqueKeysForIndex: <K extends IDBValidKey>(db: IDBDatabase) => (storeName: string) => (indexName: string) => Promise<K[]>;
export declare const getAllPrimaryKeysForIndex: <K extends IDBValidKey>(db: IDBDatabase) => (storeName: string) => (indexName: string) => (reverseDirection: boolean) => Promise<K[]>;
export declare const getDocuments: <T>(db: IDBDatabase) => (storeName: string) => (itemIds: IDBValidKey[]) => Promise<T[]>;
export declare const deleteDatabase: (dbName: string) => Promise<void>;
export {};
