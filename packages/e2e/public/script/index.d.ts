import { QueryRequest, ResponseSuccess } from './controllers';
import * as storage from './apis/storage.util';
export { SimplifiedIndexConfig } from './apis/storage.util';
export * from './controllers';
export { Operator } from './modules/filterConfiguration';
export declare type QueryResponse<TDocument, TFilterId extends string = string> = ResponseSuccess<TDocument, TFilterId>['payload'];
export declare type AbortSearch = () => void;
export declare const queryStore: <TDocument, TFilterId extends string = string>(request: QueryRequest<TDocument, TFilterId>) => [Promise<{
    documents: TDocument[];
    stats: Record<TFilterId, import("./controllers").NextFilterStateStat>;
    numberOfDocuments: number;
    _cacheStatus_: import("./controllers").CacheStatus;
}>, AbortSearch];
export declare type CreateStoreRequest<TDocument> = {
    storeId: string;
    indexConfig: storage.SimplifiedIndexConfig<TDocument>;
    keyPath: keyof TDocument;
};
export declare const createStore: <TDocument>({ storeId, indexConfig, keyPath }: CreateStoreRequest<TDocument>) => Promise<void>;
export declare type AddDocumentsToStoreRequest<TDocument> = {
    storeId: string;
    documents: TDocument[];
};
export declare const addDocumentsToStore: <TDocument>({ storeId, documents, }: AddDocumentsToStoreRequest<TDocument>) => Promise<void>;
export declare type GetIndexValuesRequest = {
    storeId: string;
    field: string;
};
export declare const getIndexValues: <T extends IDBValidKey>({ storeId, field, }: GetIndexValuesRequest) => Promise<T[]>;
export declare type GetNumberOfDocumentsInStoreRequest = {
    storeId: string;
};
export declare const getNumberOfDocumentsInStore: ({ storeId, }: GetNumberOfDocumentsInStoreRequest) => Promise<number>;
export declare type GetDocumentsRequest = {
    storeId: string;
    documentIds: IDBValidKey[];
};
export declare const getDocuments: <TDocument>({ storeId, documentIds, }: GetDocumentsRequest) => Promise<TDocument[]>;
export declare type DeleteStoreRequest = {
    storeId: string;
};
export declare const deleteStore: ({ storeId }: DeleteStoreRequest) => Promise<void>;
export declare type DeleteStoreIfExistRequest = {
    storeId: string;
};
export declare const deleteStoreIfExist: ({ storeId, }: DeleteStoreIfExistRequest) => Promise<void>;
export declare const deleteAllStores: () => Promise<void>;
export declare type DoesStoreExistRequest = {
    storeId: string;
};
export declare const doesStoreExist: ({ storeId, }: DoesStoreExistRequest) => Promise<boolean>;
