import { buildFilterConfigData } from 'modules/filterConfiguration'
import { NextFilterStateStat, Request, ResponseSuccess, ResponseFailure, validateRequest } from './models/';
import { getFilterStatitics } from './filter';
import { getOrderFromRequest } from './order';
import { getPaginatedDocuments } from './pagination';
import { doesStoreExist } from '../apis/storage.util'
import { NextFilterState } from '../modules/filteringData';
import { map } from 'ramda';

export interface FilteringStatisticsResponse {
    filtersStatisticsDetailedByFilter: number,
    numberOfMatchingItems: number,
    totalNumberOfItems: number,
};
interface RequestEvent<T> extends MessageEvent {
    data: Request<T>,
}

self.onmessage = <T>(event: RequestEvent<T>): void => {
    const requestData = event.data;
    console.log('from worker, received data: ', requestData);
    processRequest(requestData);
};


const processRequest = <T>(request: Request<T>): void => {
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
        .map(filteringData => {
          const nextFilterStates = filteringData.getNextFilterStatesForNonAppliedFilterId();
          const nextFilterStatesStats = map<Dictionary<NextFilterState>, Dictionary<NextFilterStateStat>>(nextFilterState => ({type: nextFilterState.type, nextNumberOfDocuments: nextFilterState.documentIds.length}), nextFilterStates)
          const matchingDocumentIds = filteringData.getDocumentsIdsValidated();
          return {
            stats: nextFilterStatesStats,
            numberOfDocuments: matchingDocumentIds.length,
          }
        });
      
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

type FilteringStats = {
  stats: Dictionary<NextFilterStateStat>,
  numberOfDocuments: number,
}
const postResult = <T>(documents: T[]) => (filteringStats: FilteringStats): void => {
  const response: ResponseSuccess<T> = { 
    outcome: 'success', 
    payload: {
      documents,
      ...filteringStats,
    },
  }
    self.postMessage(response);
};

const postError = (error: Error): void => {
  const response: ResponseFailure = { 
    outcome: 'error', 
    reason: error,
  }
    self.postMessage(response);
};