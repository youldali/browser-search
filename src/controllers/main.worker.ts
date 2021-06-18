import { buildFilterConfigData } from 'modules/filterConfiguration'
import { NextFilterStateStat, CacheStatus, Request, ResponseSuccess, ResponseFailure, validateRequest } from './models/';
import { getFilteringData } from './filter';
import { getOrderFromRequest } from './order';
import { getPaginatedDocuments } from './pagination';
import { doesStoreExist } from '../apis/storage.util'
import { NextFilterState, FilteringData } from '../modules/filteringData';
import { setCachedFilteringData, getCachedFilteringData } from './cache';
import { map } from 'ramda';
import { EitherAsync } from 'purify-ts/EitherAsync';
export interface FilteringStatisticsResponse {
    filtersStatisticsDetailedByFilter: number,
    numberOfMatchingItems: number,
    totalNumberOfItems: number,
};
interface RequestEvent<T> extends MessageEvent {
    data: Request<T>,
}

interface FilteringDataExtended extends FilteringData {
  _cached_: boolean
}

self.onmessage = <T>(event: RequestEvent<T>): void => {
    const requestData = event.data;
    console.log('from worker, received data: ', requestData);
    processRequest(requestData);
};


const getFilteringDataFromRequest = <T>(request: Request<T>): EitherAsync<Error, FilteringDataExtended> => {
  const eitherAsyncFilteringDataFromRequest = 
    validateRequest<T>({getStoreExist: doesStoreExist})(request)
      .map(request => buildFilterConfigData(request.filterConfig)(request.filtersApplied))
      .chain(filterConfigData => (
        getFilteringData<T>(request.storeId)(filterConfigData)
        .map(
          filteringData => {
            setCachedFilteringData(request)(filterConfigData)(filteringData)
              .run();
            return {...filteringData, _cached_: false};
          }
        )
      ));

  const eitherAsyncFilteringDataFromCache = 
    getCachedFilteringData(request)
    .map(filteringData => ({...filteringData, _cached_: true}))
    .mapLeft(e => {console.log(e); return e;});

  return eitherAsyncFilteringDataFromCache.alt(eitherAsyncFilteringDataFromRequest);
}

const processRequest = async <T>(request: Request<T>) => {
    const eitherAsyncFilteringData = getFilteringDataFromRequest(request);
    const liftedFilteringData = EitherAsync.liftEither(await eitherAsyncFilteringData.run());

    const eitherAsyncItems = 
      liftedFilteringData
        .chain(filteringData => getOrderFromRequest(request)(filteringData.getDocumentsIdsValidated()))
        .chain(getPaginatedDocuments(request));

    const eitherAsyncFilteringStats = 
      liftedFilteringData
        .map(filteringData => {
          const nextFilterStates = filteringData.getNextFilterStatesForNonAppliedFilterId();
          const nextFilterStatesStats = map<Dictionary<NextFilterState>, Dictionary<NextFilterStateStat>>(getNextFilterStateStat, nextFilterStates)
          const matchingDocumentIds = filteringData.getDocumentsIdsValidated();
          return {
            stats: nextFilterStatesStats,
            numberOfDocuments: matchingDocumentIds.length,
          }
        });

    const eitherAsyncCacheStatus: EitherAsync<Error, CacheStatus> = 
      liftedFilteringData
        .map(filteringDataExtended => filteringDataExtended._cached_ ? 'partial' : 'none' );
      
    Promise
      .all([eitherAsyncFilteringStats.run(), eitherAsyncItems.run(), eitherAsyncCacheStatus.run()])
      .then(([eitherFilteringStats, eitherItems, eitherCacheStatus]) => {
        if(eitherFilteringStats.isRight() && eitherItems.isRight() && eitherCacheStatus.isRight()) {
          const filteringStats = eitherFilteringStats.extract();
          const items = eitherItems.extract();
          const cacheStatus = eitherCacheStatus.extract();
          postResult(items)(filteringStats)(cacheStatus);
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

const getNextFilterStateStat = (nextFilterState: NextFilterState): NextFilterStateStat => (
  nextFilterState.type === 'added' ? 
  {
    type: nextFilterState.type,
    nextDocumentsAdded: nextFilterState.documentIds.length,
  } :
  {
    type: nextFilterState.type,
    nextNumberOfDocuments: nextFilterState.documentIds.length,
  }
)

type FilteringStats = {
  stats: Dictionary<NextFilterStateStat>,
  numberOfDocuments: number,
}
const postResult = <T>(documents: T[]) => (filteringStats: FilteringStats) => (cacheStatus: CacheStatus): void => {
  const response: ResponseSuccess<T> = { 
    outcome: 'success', 
    payload: {
      documents,
      _cacheStatus_: cacheStatus,
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