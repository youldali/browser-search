import { Filter, FilterConfig } from 'modules/filterConfiguration';
import { FilterFunctionsCollections, GroupIdToFilterFunctions, FilterFunctionsToGroupId } from '../../filteringFunctions.model';
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
export declare const filterFunctionsCollectionsFixture: FilterFunctionsCollections<Item>;
export declare const filterGroupToFilterFunctionsFixture: GroupIdToFilterFunctions<Item>;
export declare const filterFunctionsToFilterGroupFixture: FilterFunctionsToGroupId<Item>;
export {};
