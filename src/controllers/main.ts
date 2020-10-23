import { EitherAsync, liftEither, fromPromise } from 'purify-ts/EitherAsync'
import { 
    buildFilterConfigData,
    FiltersApplied,
    FilterConfig,
    FilterConfigData 
} from 'modules/filterConfiguration'
import { getFilteringData, getFilterStatusForItem } from 'modules/filteringStatus';
import { Item, ItemId, Request } from './request.model';
import { getFilterStatitics } from './filter';
import { getOrderedItemIds } from './order';
import { getPaginatedItems } from './pagination';

const context: DedicatedWorkerGlobalScope = self as any;
const ITEMS_PER_PAGE = 10;

export interface FilteringResponse {
    itemIds: ItemId[],
    items: Item[],
};

export interface FilteringStatisticsResponse {
    filtersStatisticsDetailedByFilter: ?FilterStatisticDetailed,
    numberOfMatchingItems: number,
    totalNumberOfItems: number,
};


interface RequestEvent extends MessageEvent {
    data: Request,
}

self.onmessage = async (event: RequestEvent) => {
    const requestData = event.data;
    processBoxRequest(requestData);
};

const processBoxRequest = (request: Request) => {

    const eitherFilterConfigData = buildFilterConfigData(request.filterConfig)(request.filtersApplied);

    const eitherFilterStatisticData = 
        liftEither(eitherFilterConfigData)
        .chain(getFilterStatitics(request.storeId));

    const items = 
        eitherFilterStatisticData
        .chain(filteringData => getOrderedItemIds(request.storeId)(request.orderBy)(filteringData.getItemsIdsValidated()))
        .chain(getPaginatedItems(request)(ITEMS_PER_PAGE));

    items.run()
    .then( eitherItems => {
        eitherItems.ifRight(postItems);
        eitherItems.ifLeft(postError);
    })
}

const postItems = (items: Item[]) => {
    context.postMessage({ type: 'ITEMS', items: items });
};

const postError = (error: Error) => {
    context.postMessage({ type: 'ERROR', error: error });
};