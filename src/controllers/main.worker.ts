import { buildFilterConfigData } from 'modules/filterConfiguration'
import { Request, validateRequest } from './models/';
import { getFilterStatitics } from './filter';
import { getOrderFromRequest } from './order';
import { getPaginatedDocuments } from './pagination';
import { doesStoreExist } from '../apis/storage.util'
import { FilteringStat } from '../modules/filteringData';


export interface FilteringStatisticsResponse {
    filtersStatisticsDetailedByFilter: number,
    numberOfMatchingItems: number,
    totalNumberOfItems: number,
};
interface RequestEvent<T> extends MessageEvent {
    data: Request<T>,
}

self.onmessage = <T>(event: RequestEvent<T>) => {
    const requestData = event.data;
    console.log('from worker, received data: ', requestData);
    processRequest(requestData);
};


const processRequest = <T>(request: Request<T>) => {
    const eitherAsyncFilteringData = 
      validateRequest<T>({getStoreExist: doesStoreExist})(request)
        .map(request => buildFilterConfigData(request.filterConfig)(request.filtersApplied))
        .chain(getFilterStatitics(request.storeId));

    const eitherAsyncItems = 
      eitherAsyncFilteringData
        .chain(filteringData => getOrderFromRequest(request)(filteringData.getDocumentsIdsValidated()))
        .chain(getPaginatedDocuments(request));

    const eitherAsyncFilteringStats = 
      eitherAsyncFilteringData
        .map(filteringData => filteringData.getFilteringStatsByNonAppliedFilterId());
      
    Promise
      .all([eitherAsyncFilteringStats.run(), eitherAsyncItems.run()])
      .then(([eitherFilteringStats, eitherItems]) => {
        if(eitherFilteringStats.isRight() && eitherItems.isRight()) {
          const filteringStats = eitherFilteringStats.extract();
          const items = eitherItems.extract();
          postResult(items)(filteringStats);
        }
        else if (eitherItems.isLeft()) {
          const error = eitherItems.extract();
          postError(error);
        }
        else if (eitherFilteringStats.isLeft()) {
          const error = eitherFilteringStats.extract();
          postError(error);
        }
      })
}

const postResult = <T>(items: T[]) => (stats: Dictionary<FilteringStat>) => {
    self.postMessage({ 
        outcome: 'success', 
        payload: {
            type: 'items',
            data: {
              items,
              stats,
            }
        },
    });
};

const postError = (error: Error) => {
    self.postMessage({ 
        outcome: 'error', 
        reason: error,
    });
};