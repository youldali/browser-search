import { 
    buildFilterConfigData,
    FiltersApplied,
    FilterConfig,
    FilterConfigData 
} from 'modules/filterConfiguration'
import { getFilteringData, getFilterStatusForItem } from 'modules/filteringStatus';

type ItemId = string;
type Item = any;

const ITEMS_PER_PAGE = 10;

export interface Request {
    filterConfig: FilterConfig
	filtersApplied: FiltersApplied,
	orderBy: string,
	page: number
};

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

    eitherFilterConfigData.ifRight((filterConfigData) => {
        const filteringData = getFilteringData(filterConfigData)
        const getFilteringStatus = getFilterStatusForItem(filteringData);
    })
    
}