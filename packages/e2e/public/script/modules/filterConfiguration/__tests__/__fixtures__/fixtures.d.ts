import { Filter } from '../../filterConfig.model';
declare type ItemActivity = 'swimming' | 'tennis' | 'football' | 'golfing';
interface Item {
    id: number;
    price: number;
    numberOfPeople: number;
    activity: ItemActivity[];
}
declare type FilterIds = 'priceMin' | 'priceMax' | 'numberOfPeople' | 'activity-1' | 'activity-2' | 'activity-3';
export declare const getFilterDictionaryFixture: (overrides?: Partial<Record<FilterIds, Filter<Item, FilterIds>>>) => Record<FilterIds, Filter<Item, FilterIds>>;
export declare const getFilterConfigFixture: (overrides?: import("../../filterConfig.model").GroupOfFilters<Item, FilterIds>[]) => import("../../filterConfig.model").GroupOfFilters<Item, FilterIds>[];
export declare const getFiltersIdsAppliedFixture: (overrides?: FilterIds[]) => FilterIds[];
export {};
