import { EitherAsync } from 'purify-ts/EitherAsync';
import { Operator } from 'modules/filterConfiguration/operators';
declare enum IndexType {
    simple = "simple",
    array = "array"
}
export interface SimplifiedIndexConfig {
    [key: string]: IndexType;
}
export declare const createStore: (storeName: string) => (simplifiedIndexConfig: SimplifiedIndexConfig) => (keyPath: string) => EitherAsync<Error, void>;
export declare const deleteStore: (storeName: string) => EitherAsync<Error, void>;
export declare const addDataToStore: <T>(storeName: string) => (data: T[]) => EitherAsync<Error, void>;
export declare const iterateOverStore: <T>(storeName: string) => (callback: (primaryKey: StringOrNumber, item: T) => void) => EitherAsync<Error, void>;
export declare const getPrimaryKeysMatchingOperator: (storeName: string) => (indexName: string) => (operator: Operator) => (value: any) => EitherAsync<Error, StringOrNumber[]>;
export declare const getAllPrimaryKeysForIndex: (storeName: string) => (indexName: string) => (reverseDirection: boolean) => EitherAsync<Error, StringOrNumber[]>;
export declare const getAllUniqueKeysForIndex: (storeName: string) => (indexName: string) => EitherAsync<Error, StringOrNumber[]>;
export declare const getItems: <T>(storeName: string) => (itemIds: StringOrNumber[]) => EitherAsync<Error, T[]>;
export declare const getItemsCount: (storeName: string) => EitherAsync<Error, number>;
export declare const doesStoreExist: (storeName: string) => EitherAsync<Error, boolean>;
export declare const getKeyRangeMatchingOperator: (operator: Operator) => (value: any) => IDBKeyRange;
export {};
