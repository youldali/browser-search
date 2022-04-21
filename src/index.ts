import { identity } from 'ramda';

import { Request, ResponseFailure, ResponseSuccess } from './controllers';
import { functionToWorkerURL } from './helpers/worker.util';
import * as storage from './apis/storage.util';
import { deleteCache } from './apis/cache';

export { SimplifiedIndexConfig } from './apis/storage.util'
export * from './controllers'; 
export { Operator } from './modules/filterConfiguration'

const workerFunction = () => {
  //@worker
}

export type SearchResponse<T, TFilterId extends string = string> = ResponseSuccess<T, TFilterId>['payload']
export type AbortSearch = () => void;
export const searchStore = <T, TFilterId extends string = string>(request: Request<T, TFilterId>): [Promise<SearchResponse<T, TFilterId>>, AbortSearch] => {
  const applicationWorker = new Worker(functionToWorkerURL(workerFunction));
  applicationWorker.postMessage(request);

  let rejectResult: (reason?: Error) => void;
  const result: Promise<SearchResponse<T>> = new Promise((resolve, reject) => {
    rejectResult = reject;
    applicationWorker.onmessage = (event: MessageEvent<ResponseSuccess<T> | ResponseFailure>) => {
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

export const createStore = <T>(storeName: string) => (indexConfig: storage.SimplifiedIndexConfig<T>) => async (keyPath: keyof T): Promise<void> => {
  if(await doesStoreExist(storeName)){
    await deleteCache().run();
  }

  return (
    storage.createStore<T>(storeName)(indexConfig)(keyPath)
      .run()
      .then(eitherValues => (
        eitherValues.caseOf({ 
          Left: error => {throw error}, 
          Right: identity
        })
      ))
  );
}

export const addDocumentsToStore = <T>(storeName: string) => async (data: T[]): Promise<void> => {
  await deleteCache().run();
  return (
    storage.addDocumentsToStore(storeName)(data)
    .run()
    .then(eitherValues => (
      eitherValues.caseOf({ 
        Left: error => {throw error}, 
        Right: identity
      })
    ))
  )
}

export const getAllValuesOfProperty = <T extends IDBValidKey>(storeName: string) => (propertyName: string): Promise<T[]> => (
  storage.getAllUniqueKeysForIndex<T>(storeName)(propertyName)
    .run()
    .then(eitherValues => (
      eitherValues.caseOf({ 
        Left: error => {throw error}, 
        Right: identity
      })
    ))
)

export const getNumberOfDocumentsInStore = (storeName: string): Promise<number> => (
  storage.getNumberOfDocumentsInStore(storeName)
    .run()
    .then(eitherValues => (
      eitherValues.caseOf({ 
        Left: error => {throw error}, 
        Right: identity
      })
    ))
)

export const getDocuments = <T>(storeName: string) => (documentIds: IDBValidKey[]): Promise<T[]> => (
  storage.getDocuments<T>(storeName)(documentIds)
    .run()
    .then(eitherValues => (
      eitherValues.caseOf({ 
        Left: error => {throw error}, 
        Right: identity
      })
    ))
)

export const deleteStore = async (storeName: string): Promise<void> => {
  await deleteCache().run();
  return (
    storage.deleteStore(storeName)
      .run()
      .then(eitherValues => (
        eitherValues.caseOf({ 
          Left: error => {throw error}, 
          Right: identity
        })
      ))
  )
}

export const deleteStoreIfExist = async (storeName: string): Promise<void> => {
  await deleteCache().run();
  return (
    storage.deleteStoreIfExist(storeName)
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

export const doesStoreExist = (storeName: string): Promise<boolean> => (
  storage.doesStoreExist(storeName)
    .run()
    .then(eitherValues => (
      eitherValues.caseOf({ 
        Left: error => {throw error}, 
        Right: identity
      })
    ))
)

