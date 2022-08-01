import { identity } from 'ramda';

import { QueryRequest, ResponseFailure, ResponseSuccess } from './controllers';
import { functionToWorkerURL } from './helpers/worker.util';
import * as storage from './apis/storage.util';
import { deleteCache } from './apis/cache';

export { SimplifiedIndexConfig } from './apis/storage.util'
export * from './controllers'; 
export { Operator } from './modules/filterConfiguration'

const workerFunction = () => {
  //@worker
}

export type QueryResponse<TDocument, TFilterId extends string = string> = ResponseSuccess<TDocument, TFilterId>['payload']
export type AbortSearch = () => void;
export const queryStore = <TDocument, TFilterId extends string = string>(request: QueryRequest<TDocument, TFilterId>): [Promise<QueryResponse<TDocument, TFilterId>>, AbortSearch] => {
  const applicationWorker = new Worker(functionToWorkerURL(workerFunction));
  applicationWorker.postMessage(request);

  let rejectResult: (reason?: Error) => void;
  const result: Promise<QueryResponse<TDocument>> = new Promise((resolve, reject) => {
    rejectResult = reject;
    applicationWorker.onmessage = (event: MessageEvent<ResponseSuccess<TDocument> | ResponseFailure>) => {
      const result = event.data;
      result.outcome === 'error' ? reject(result.reason) : resolve(result.payload);
    }
  });

  const abort = () => {
    rejectResult(new Error('The search request was aborted'));
    applicationWorker.terminate();
  }
  
  return [result, abort];
};

export type CreateStoreRequest<TDocument> = {
  storeId: string;
  indexConfig: storage.SimplifiedIndexConfig<TDocument>,
  keyPath: keyof TDocument;
};
export const createStore = async <TDocument>({
  storeId,
  indexConfig,
  keyPath
}: CreateStoreRequest<TDocument>): Promise<void> => {
  if(await doesStoreExist({storeId})){
    await deleteCache().run();
  }

  return (
    storage.createStore<TDocument>(storeId)(indexConfig)(keyPath)
      .run()
      .then(eitherValues => (
        eitherValues.caseOf({ 
          Left: error => {throw error}, 
          Right: identity
        })
      ))
  );
}

export type AddDocumentsToStoreRequest<TDocument> = {
  storeId: string;
  documents: TDocument[],
};
export const addDocumentsToStore = async <TDocument>({
  storeId,
  documents,
}: AddDocumentsToStoreRequest<TDocument>): Promise<void> => {
  await deleteCache().run();
  return (
    storage.addDocumentsToStore(storeId)(documents)
    .run()
    .then(eitherValues => (
      eitherValues.caseOf({ 
        Left: error => {throw error}, 
        Right: identity
      })
    ))
  )
}


export type GetIndexValuesRequest = {
  storeId: string;
  field: string,
};
export const getIndexValues = <T extends IDBValidKey>({
  storeId,
  field,
}: GetIndexValuesRequest): Promise<T[]> => (
  storage.getAllUniqueKeysForIndex<T>(storeId)(field)
    .run()
    .then(eitherValues => (
      eitherValues.caseOf({ 
        Left: error => {throw error}, 
        Right: identity
      })
    ))
)

export type GetNumberOfDocumentsInStoreRequest = {
  storeId: string;
};
export const getNumberOfDocumentsInStore = ({
  storeId,
}: GetNumberOfDocumentsInStoreRequest): Promise<number> => (
  storage.getNumberOfDocumentsInStore(storeId)
    .run()
    .then(eitherValues => (
      eitherValues.caseOf({ 
        Left: error => {throw error}, 
        Right: identity
      })
    ))
)


export type GetDocumentsRequest = {
  storeId: string;
  documentIds: IDBValidKey[],
};
export const getDocuments = <TDocument>({
  storeId,
  documentIds,
}: GetDocumentsRequest): Promise<TDocument[]> => (
  storage.getDocuments<TDocument>(storeId)(documentIds)
    .run()
    .then(eitherValues => (
      eitherValues.caseOf({ 
        Left: error => {throw error}, 
        Right: identity
      })
    ))
)


export type DeleteStoreRequest = {
  storeId: string;
};
export const deleteStore = async ({
  storeId
}: DeleteStoreRequest): Promise<void> => {
  await deleteCache().run();
  return (
    storage.deleteStore(storeId)
      .run()
      .then(eitherValues => (
        eitherValues.caseOf({ 
          Left: error => {throw error}, 
          Right: identity
        })
      ))
  )
}


export type DeleteStoreIfExistRequest = {
  storeId: string;
};
export const deleteStoreIfExist = async ({
  storeId,
}: DeleteStoreIfExistRequest): Promise<void> => {
  await deleteCache().run();
  return (
    storage.deleteStoreIfExist(storeId)
      .run()
      .then(eitherValues => (
        eitherValues.caseOf({ 
          Left: error => {throw error}, 
          Right: identity
        })
      ))
  )
}

export const deleteAllStores = async (): Promise<void> => {
  await deleteCache().run();
  return (
    storage.deleteDatabase()
      .run()
      .then(eitherValues => (
        eitherValues.caseOf({ 
          Left: error => {throw error}, 
          Right: identity
        })
      ))
  );
}


export type DoesStoreExistRequest = {
  storeId: string;
};
export const doesStoreExist = ({
  storeId,
}: DoesStoreExistRequest): Promise<boolean> => (
  storage.doesStoreExist(storeId)
    .run()
    .then(eitherValues => (
      eitherValues.caseOf({ 
        Left: error => {throw error}, 
        Right: identity
      })
    ))
)

