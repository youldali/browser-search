import { Item, ItemId } from './request.model';
export interface FilteringResponse {
    itemIds: ItemId[];
    items: Item[];
}
export interface FilteringStatisticsResponse {
    filtersStatisticsDetailedByFilter: number;
    numberOfMatchingItems: number;
    totalNumberOfItems: number;
}
