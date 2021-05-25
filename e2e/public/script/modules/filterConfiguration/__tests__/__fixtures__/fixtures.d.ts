import { Filter } from '../../filterConfig.model';
declare type ItemActivity = 'swimming' | 'tennis' | 'football' | 'golfing';
interface Item {
    id: number;
    price: number;
    numberOfPeople: number;
    activity: ItemActivity[];
}
export declare const getFilterDictionaryFixture: (overrides?: Partial<Dictionary<Filter<Item>>>) => Dictionary<Filter<Item>> & Partial<Dictionary<Filter<Item>>>;
export declare const getFilterConfigFixture: (overrides?: import("../../filterConfig.model").GroupOfFilters<Item>[]) => import("../../filterConfig.model").GroupOfFilters<Item>[];
export declare const getFiltersIdsAppliedFixture: (overrides?: string[]) => string[];
export {};
