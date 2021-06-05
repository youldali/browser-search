import { identity } from 'ramda';
import { Request } from './controllers';
import { functionToWorkerURL } from './helpers/worker.util';
import * as storage from './apis/storage.util';

export * from './controllers'; 
export { Operator } from './modules/filterConfiguration'

const workerFunction = () => {
  //@worker
}



export const processRequest = <T>(request: Request<T>) => {
  const applicationWorker = new Worker(functionToWorkerURL(workerFunction));
  applicationWorker.postMessage(request);

  const result = new Promise((resolve, reject) => {
    applicationWorker.onmessage = (event) => {
      const result = event.data;
      result.outcome === 'error' ? reject(result.reason) : resolve(result.payload);
    }
  });

  const abort = () => applicationWorker.terminate();

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

export const addDataToStore = <T>(storeName: string) => (data: T[]): Promise<void> => (
  storage.addDataToStore(storeName)(data)
    .run()
    .then(eitherValues => (
      eitherValues.caseOf({ 
        Left: error => {throw error}, 
        Right: identity
      })
    ))
)

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

export const getCount = (storeName: string): Promise<number> => (
  storage.getItemsCount(storeName)
    .run()
    .then(eitherValues => (
      eitherValues.caseOf({ 
        Left: error => {throw error}, 
        Right: identity
      })
    ))
)

export const getItems = <T>(storeName: string) => (itemIds: IDBValidKey[]): Promise<T[]> => (
  storage.getItems<T>(storeName)(itemIds)
    .run()
    .then(eitherValues => (
      eitherValues.caseOf({ 
        Left: error => {throw error}, 
        Right: identity
      })
    ))
)

export const deleteStore = (storeName: string): Promise<void> => (
  storage.deleteStore(storeName)
    .run()
    .then(eitherValues => (
      eitherValues.caseOf({ 
        Left: error => {throw error}, 
        Right: identity
      })
    ))
)

export const deleteStoreIfExist = (storeName: string): Promise<void> => (
  storage.deleteStoreIfExist(storeName)
    .run()
    .then(eitherValues => (
      eitherValues.caseOf({ 
        Left: error => {throw error}, 
        Right: identity
      })
    ))
)

export const deleteAllStores = (): Promise<void> => (
  storage.deleteDatabase()
    .run()
    .then(eitherValues => (
      eitherValues.caseOf({ 
        Left: error => {throw error}, 
        Right: identity
      })
    ))
)

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

