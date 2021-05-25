import { buildFilterConfigData } from 'modules/filterConfiguration'
import { Item, ItemId, Request, validateRequest } from './models/';
import { getFilterStatitics } from './filter';
import { getOrderFromRequest } from './order';
import { getPaginatedItems } from './pagination';
import { doesStoreExist } from '../apis/storage.util'
export interface FilteringResponse {
    itemIds: ItemId[],
    items: Item[],
};

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
    const eitherAsyncRequest = validateRequest<T>({getStoreExist: doesStoreExist})(request);
    const eitherFilterConfigData = eitherAsyncRequest.map(request => 
    buildFilterConfigData(request.filterConfig)(request.filtersApplied));

    const eitherFilterStatisticData = eitherFilterConfigData
      .chain(getFilterStatitics(request.storeId));

    const items = eitherFilterStatisticData
      .chain(filteringData => getOrderFromRequest(request)(filteringData.getItemsIdsValidated()))
      .chain(getPaginatedItems(request));

    items
      .run()
      .then( eitherItems => {
          eitherItems.ifRight(postItems);
          eitherItems.ifLeft(postError);
      })
}

const postItems = (items: Item[]) => {
    self.postMessage({ 
        outcome: 'success', 
        payload: {
            type: 'items',
            data: items
        },
    });
};

const postError = (error: Error) => {
    self.postMessage({ 
        outcome: 'error', 
        reason: error,
    });
};