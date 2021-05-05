import { Filter, FilterConfig } from '../../filterConfig.model';
declare type ItemActivity = 'swimming' | 'tennis' | 'football' | 'golfing';
interface Item {
    id: number;
    price: number;
    numberOfPeople: number;
    activity: ItemActivity[];
}
export declare const filterDictionaryFixture: Dictionary<Filter<Item>>;
export declare const filterConfigFixture: FilterConfig<Item>;
export declare const filtersIdsAppliedFixture: string[];
export {};
