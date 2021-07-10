import { Filter } from '../../filterConfig.model';
declare type ItemActivity = 'swimming' | 'tennis' | 'football' | 'golfing';
interface Item {
    id: number;
    price: number;
    numberOfPeople: number;
    activity: ItemActivity[];
}
export declare const getFilterDictionaryFixture: (overrides?: Partial<Record<string, Filter<Item>>>) => Record<string, Filter<Item>> & Partial<Record<string, Filter<Item>>>;
export declare const getFilterConfigFixture: (overrides?: import("../../filterConfig.model").GroupOfFilters<Item>[]) => import("../../filterConfig.model").GroupOfFilters<Item>[];
export declare const getFiltersIdsAppliedFixture: (overrides?: string[]) => string[];
export {};
