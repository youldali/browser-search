import { Filter, FilterConfig } from 'modules/filterConfiguration/filterConfig.model';
import { QueryRequest } from '../../request.model';
declare type ItemActivity = 'swimming' | 'tennis' | 'football' | 'golfing';
interface Item {
    id: number;
    price: number;
    numberOfPeople: number;
    activity: ItemActivity[];
}
export declare const filterDictionaryFixture: Record<string, Filter<Item>>;
export declare const filterConfigFixture: FilterConfig<Item>;
export declare const getRequestFixture: (overrides?: Partial<QueryRequest<Item, string>>) => QueryRequest<Item, string>;
export declare const getShortRequestFixture: (overrides?: Partial<QueryRequest<Item, string>>) => QueryRequest<Item, string>;
export {};
