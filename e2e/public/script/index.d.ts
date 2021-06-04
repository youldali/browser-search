import { Request } from './controllers';
import * as storage from './apis/storage.util';
export * from './controllers';
export { Operator } from './modules/filterConfiguration';
export declare const processRequest: <T>(request: Request<T>) => Promise<unknown>;
export declare const createStore: (storeName: string) => (indexConfig: storage.SimplifiedIndexConfig) => (keyPath: string) => Promise<void>;
export declare const addDataToStore: <T>(storeName: string) => (data: T[]) => Promise<void>;
export declare const getAllValuesOfProperty: <T extends IDBValidKey>(storeName: string) => (propertyName: string) => Promise<T[]>;
export declare const getCount: (storeName: string) => Promise<number>;
export declare const getItems: <T>(storeName: string) => (itemIds: IDBValidKey[]) => Promise<T[]>;
export declare const deleteStore: (storeName: string) => Promise<void>;
export declare const deleteStoreIfExist: (storeName: string) => Promise<void>;
export declare const deleteAllStores: () => Promise<void>;
export declare const doesStoreExist: (storeName: string) => Promise<boolean>;
