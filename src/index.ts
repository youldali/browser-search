import { Request } from 'controllers/request.model';
import { functionToWorkerURL } from 'helpers/worker.util';

const workerFunction = () => {
  //@worker
}

const applicationWorker = new Worker(functionToWorkerURL(workerFunction));
applicationWorker.onmessage = (e) => console.log('received', e.data);

export const process = (request: Request) => {
  console.log('REQUEST:', request);
  applicationWorker.postMessage({data: request});
};

export const check = () => {console.log('check !')};