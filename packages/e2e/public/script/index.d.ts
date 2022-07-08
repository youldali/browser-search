import { Request, ResponseSuccess } from './controllers';
import * as storage from './apis/storage.util';
export { SimplifiedIndexConfig } from './apis/storage.util';
export * from './controllers';
export { Operator } from './modules/filterConfiguration';
export declare type SearchResponse<T, TFilterId extends string = string> = ResponseSuccess<T, TFilterId>['payload'];
export declare type AbortSearch = () => void;
export declare const searchStore: <T, TFilterId extends string = string>(request: Request<T, TFilterId>) => [Promise<{
    documents: T[];
    stats: Record<TFilterId, import("./controllers").NextFilterStateStat>;
    numberOfDocuments: number;
    _cacheStatus_: import("./controllers").CacheStatus;
}>, AbortSearch];
export declare const createStore: <T>(storeName: string) => (indexConfig: storage.SimplifiedIndexConfig<T>) => (keyPath: keyof T) => Promise<void>;
export declare const addDocumentsToStore: <T>(storeName: string) => (data: T[]) => Promise<void>;
export declare const getAllValuesOfProperty: <T extends IDBValidKey>(storeName: string) => (propertyName: string) => Promise<T[]>;
export declare const getNumberOfDocumentsInStore: (storeName: string) => Promise<number>;
export declare const getDocuments: <T>(storeName: string) => (documentIds: IDBValidKey[]) => Promise<T[]>;
export declare const deleteStore: (storeName: string) => Promise<void>;
export declare const deleteStoreIfExist: (storeName: string) => Promise<void>;
export declare const deleteAllStores: () => Promise<void>;
export declare const doesStoreExist: (storeName: string) => Promise<boolean>;