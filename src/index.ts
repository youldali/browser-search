import { Request } from 'controllers/request.model'
import DataWorker from 'web-worker:./controllers/main';

export const process = (request: Request) => {
  const dataWorker = new DataWorker();
  dataWorker.postMessage({data: request});
};
