import { EitherAsync } from 'purify-ts/EitherAsync';
import { Operator } from 'modules/filterConfiguration/operators';
export interface SimplifiedIndexConfig<T> {
    simple?: Array<keyof T>;
    array?: Array<keyof T>;
}
export declare const createStore: <T>(storeName: string) => (simplifiedIndexConfig: SimplifiedIndexConfig<T>) => (keyPath: keyof T) => EitherAsync<Error, void>;
export declare const createStoreIfNotExist: <T>(storeName: string) => (simplifiedIndexConfig: SimplifiedIndexConfig<T>) => (keyPath: keyof T) => EitherAsync<Error, void>;
export declare const deleteStore: (storeName: string) => EitherAsync<Error, void>;
export declare const deleteStoreIfExist: (storeName: string) => EitherAsync<Error, void>;
export declare const deleteDatabase: () => EitherAsync<Error, void>;
export declare const addDocumentsToStore: <T>(storeName: string) => (data: T[]) => EitherAsync<Error, void>;
export declare const iterateOverStore: <T>(storeName: string) => (callback: (primaryKey: ItemKey, item: T) => void) => EitherAsync<Error, void>;
export declare const getPrimaryKeysMatchingOperator: (storeName: string) => (indexName: string) => (operator: Operator) => (operand: any) => EitherAsync<Error, ItemKey[]>;
export declare const getAllPrimaryKeysForIndex: (storeName: string) => (indexName: string) => (reverseDirection: boolean) => EitherAsync<Error, ItemKey[]>;
export declare const getAllUniqueKeysForIndex: <K extends IDBValidKey>(storeName: string) => (indexName: string) => EitherAsync<Error, K[]>;
export declare const getDocuments: <T>(storeName: string) => (documentIds: IDBValidKey[]) => EitherAsync<Error, T[]>;
export declare const getNumberOfDocumentsInStore: (storeName: string) => EitherAsync<Error, number>;
export declare const doesStoreExist: (storeName: string) => EitherAsync<Error, boolean>;
export declare const getKeyRangeMatchingOperator: (operator: Operator) => (value: any) => IDBKeyRange;
