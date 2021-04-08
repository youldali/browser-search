import { buildFilterConfigData } from 'modules/filterConfiguration'
import { Item, ItemId, Request } from './request.model';
import { getFilterStatitics } from './filter';
import { getOrderedItemIds } from './order';
import { getPaginatedItems } from './pagination';

//const context: DedicatedWorkerGlobalScope = self as any;
const ITEMS_PER_PAGE = 10;

export interface FilteringResponse {
    itemIds: ItemId[],
    items: Item[],
};

export interface FilteringStatisticsResponse {
    filtersStatisticsDetailedByFilter: number,
    numberOfMatchingItems: number,
    totalNumberOfItems: number,
};


interface RequestEvent extends MessageEvent {
    data: Request,
}

self.onmessage = (event: RequestEvent) => {
    const requestData = event.data;
    console.log('from worker, received data: ', requestData);
    processRequest(requestData);
};


const processRequest = (request: Request) => {

    const eitherFilterConfigData = buildFilterConfigData(request.filterConfig)(request.filtersApplied);

    const eitherFilterStatisticData = eitherFilterConfigData
        .chain(getFilterStatitics(request.storeId));

    const items = 
        eitherFilterStatisticData
        .chain(filteringData => getOrderedItemIds(request)(filteringData.getItemsIdsValidated()))
        .chain(getPaginatedItems(request)(ITEMS_PER_PAGE));

    items.run()
    .then( eitherItems => {
        eitherItems.ifRight(postItems);
        eitherItems.ifLeft(postError);
    })
}

const postItems = (items: Item[]) => {
    self.postMessage({ 
        type: 'items', 
        payload: {items},
    });
};

const postError = (error: Error) => {
    self.postMessage({ 
        type: 'error', 
        error: error,
    });
};