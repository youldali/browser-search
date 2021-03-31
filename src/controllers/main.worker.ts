import { liftEither } from 'purify-ts/EitherAsync'
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
    //processBoxRequest(requestData);
    console.log(processBoxRequest);
    self.postMessage({ 
        type: 'from worker',
        data: 'BIEN RECU !', 
    });

    const a = ta();
    a.then(v => {
        self.postMessage({ 
            type: 'from worker Promise Value',
            data: v, 
        });
    })
};

const ta = async () => {
    const p: Promise<number> = new Promise((resolve) => {
        setTimeout( function() {
            resolve(1000) 
        }, 250) 
        }) 

    const v = await p;
    return (v * 5);
}

const processBoxRequest = (request: Request) => {

    const eitherFilterConfigData = buildFilterConfigData(request.filterConfig)(request.filtersApplied);

    const eitherFilterStatisticData = 
        liftEither(eitherFilterConfigData)
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