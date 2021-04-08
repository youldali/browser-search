import { Request } from 'controllers/request.model';
import { functionToWorkerURL } from 'helpers/worker.util';
export { addDataToStore, createStore } from 'apis/storage.util';

const workerFunction = () => {
  //@worker
}

const applicationWorker = new Worker(functionToWorkerURL(workerFunction));
applicationWorker.onmessage = (e) => console.log('received', e.data);

export const processRequest = (request: Request) => {
  applicationWorker.postMessage({data: request});
};

export const check = () => {console.log('check !')};