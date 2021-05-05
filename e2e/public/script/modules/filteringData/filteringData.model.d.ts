import { GroupId, FilterId } from 'modules/filterConfiguration';
import { FilteredItemStatus } from 'modules/filteringStatus';
import { FilterConfigData } from 'modules/filterConfiguration';
declare type ItemId = string | number;
export interface FilterIdToMatchingItemIds {
    [key: string]: ItemId[];
}
export declare type FilteringStat = {
    type: 'added' | 'narrowed';
    itemIds: ItemId[];
};
export interface FilteringData {
    getFilteringStatsByNonAppliedFilterId: () => Dictionary<FilteringStat>;
    getFilteringStatForFilterId: (filterId: FilterId) => FilteringStat;
    getItemsIdsRejectedByGroupId: (groupId: GroupId) => ItemId[];
    getItemsIdsRejectedByMultipleFilters: () => ItemId[];
    getItemsIdsValidated: () => ItemId[];
}
export declare const createFilteringData: <T>(filterConfigData: FilterConfigData<T>) => (filterIdToMatchingItemIds: FilterIdToMatchingItemIds) => {
    addFilteredObjectStatus(filteredItemStatus: FilteredItemStatus, itemId: ItemId): void;
    setStatusValue(filteredItemStatus: FilteredItemStatus, idList: ItemId[]): void;
    done(): FilteringData;
};
export {};
