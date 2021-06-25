import { identity } from 'ramda';
import { Request, ResponseSuccess } from './controllers';
import { functionToWorkerURL } from './helpers/worker.util';
import * as storage from './apis/storage.util';
import { deleteCache } from './apis/cache';

export * from './controllers'; 
export { Operator } from './modules/filterConfiguration'

const workerFunction = () => {
  //@worker
}

type RequestPreset<T> = Pick<Request<T>, 'storeId' | 'filterConfig'>;
type RequestParams<T> = Omit<Request<T>, 'storeId' | 'filterConfig'>;
type SearchResponse<T> = Pick<ResponseSuccess<T>, 'payload'>

export const searchStore = <T>(requestPreset: RequestPreset<T>) => (requestParams: RequestParams<T>): [Promise<SearchResponse<T>>, () => void] => {
  const request: Request<T> = {...requestPreset, ...requestParams};
  const applicationWorker = new Worker(functionToWorkerURL(workerFunction));
  applicationWorker.postMessage(request);

  let rejectResult: (reason?: any) => void;
  const result: Promise<SearchResponse<T>> = new Promise((resolve, reject) => {
    rejectResult = reject;
    applicationWorker.onmessage = (event) => {
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

export const createStore = (storeName: string) => (indexConfig: storage.SimplifiedIndexConfig) => (keyPath: string): Promise<void> => (
  storage.createStore(storeName)(indexConfig)(keyPath)
    .run()
    .then(eitherValues => (
      eitherValues.caseOf({ 
        Left: error => {throw error}, 
        Right: identity
      })
    ))
)

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

