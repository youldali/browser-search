import { Filter, FilterConfig } from 'modules/filterConfiguration';
import { FilterIdToMatchingDocumentIds } from '../../filteringData.model';
import { FilteredItemStatus } from 'modules/filteringStatus';
declare type ItemActivity = 'swimming' | 'tennis' | 'football' | 'golfing';
export interface Item {
    id: number;
    price: number;
    numberOfPeople: number;
    activity: ItemActivity[];
}
export declare const itemsFixture: Item[];
export declare const filterDictionaryFixture: Record<string, Filter<Item>>;
export declare const filterConfigFixture: FilterConfig<Item>;
export declare const filtersIdsAppliedFixture: string[];
export declare const filterConfigDataFixture: import("modules/filterConfiguration").FilterConfigData<Item, string>;
export declare const filterIdToMatchingDocumentIdsFixture: FilterIdToMatchingDocumentIds;
export declare const getFilterStatusForItem: (target: Item) => FilteredItemStatus;
export declare const itemToFilteringStatusFixture: Map<any, FilteredItemStatus>;
export {};
