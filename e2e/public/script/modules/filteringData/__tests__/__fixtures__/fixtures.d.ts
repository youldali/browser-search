import { Filter, FilterConfig } from 'modules/filterConfiguration';
import { FilterIdToMatchingItemIds } from '../../filteringData.model';
import { FilteredItemStatus } from 'modules/filteringStatus';
declare type ItemActivity = 'swimming' | 'tennis' | 'football' | 'golfing';
export interface Item {
    id: number;
    price: number;
    numberOfPeople: number;
    activity: ItemActivity[];
}
export declare const itemsFixture: Item[];
export declare const filterDictionaryFixture: Dictionary<Filter<Item>>;
export declare const filterConfigFixture: FilterConfig<Item>;
export declare const filtersIdsAppliedFixture: string[];
export declare const filterConfigDataFixture: import("modules/filterConfiguration").FilterConfigData<Item>;
export declare const filterIdToMatchingItemIdsFixture: FilterIdToMatchingItemIds;
export declare const getFilterStatusForItem: (target: Item) => FilteredItemStatus;
export declare const itemToFilteringStatusFixture: Map<any, FilteredItemStatus>;
export {};
