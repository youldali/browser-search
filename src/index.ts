import { identity } from 'ramda';
import { Request } from './controllers/request.model';
import { functionToWorkerURL } from './helpers/worker.util';
import * as storage from './apis/storage.util';

export * from './controllers/request.model'; 
export { Operators } from './modules/filterConfiguration'

const workerFunction = () => {
  //@worker
}

const applicationWorker = new Worker(functionToWorkerURL(workerFunction));

export const processRequest = <T>(request: Request<T>) => {
  applicationWorker.postMessage(request);

  return new Promise((resolve, reject) => {
    applicationWorker.onmessage = (event) => {
      const result = event.data;
      result.outcome === 'error' ? reject(result.reason) : resolve(result.payload);
    }
  })
};

export const createStore = (storeName: string) => (indexConfig: storage.SimplifiedIndexConfig) => (keyPath: string) => (
  storage.createStore(storeName)(indexConfig)(keyPath)
    .run()
)

export const addDataToStore = <T>(storeName: string) => (data: T[]) => (
  storage.addDataToStore(storeName)(data)
    .run()
)

export const getAllValuesOfProperty = (storeName: string) => (propertyName: string): Promise<unknown> => (
  storage.getAllUniqueKeysForIndex(storeName)(propertyName)
    .run()
    .then(eitherValues => (
      eitherValues.caseOf({ 
        Left: error => {throw error}, 
        Right: identity
      })
    ))
)

export const deleteStore = (storeName: string) => (
  storage.deleteStore(storeName)
    .run()
)

