import { Request } from 'controllers/request.model';
import { functionToWorkerURL } from 'helpers/worker.util';
import * as storage from 'apis/storage.util';

const workerFunction = () => {
  //@worker
}

const applicationWorker = new Worker(functionToWorkerURL(workerFunction));
applicationWorker.onmessage = (e) => console.log('received', e.data);

export const processRequest = (request: Request) => {
  applicationWorker.postMessage({data: request});
};

export const check = () => {console.log('check !')};

export const createStore = (storeName: string) => (indexConfig: storage.SimplifiedIndexConfig) => (keyPath: string) => (
  storage.createStore(storeName)(indexConfig)(keyPath)
    .run()
)

export const addDataToStore = (storeName: string) => (data: object[]) => (
  storage.addDataToStore(storeName)(data)
    .run()
)

export const getAllValuesOfProperty = (storeName: string) => (propertyName: string) => (
  storage.getAllUniqueKeysForIndex(storeName)(propertyName)
)

export const deleteStore = (storeName: string) => (
  storage.deleteStore(storeName)
    .run()
)