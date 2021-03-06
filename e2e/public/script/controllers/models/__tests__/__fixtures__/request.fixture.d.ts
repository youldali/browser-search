import { Request } from '../../request.model';
import { Filter, FilterConfig } from 'modules/filterConfiguration/filterConfig.model';
declare type ItemActivity = 'swimming' | 'tennis' | 'football' | 'golfing';
interface Item {
    id: number;
    price: number;
    numberOfPeople: number;
    activity: ItemActivity[];
}
export declare const filterDictionaryFixture: Record<string, Filter<Item>>;
export declare const filterConfigFixture: FilterConfig<Item>;
export declare const getRequestFixture: (overrides?: Partial<Request<Item, string>>) => Request<Item, string> & Partial<Request<Item, string>>;
export declare const getShortRequestFixture: (overrides?: Partial<Request<Item, string>>) => Request<Item, string> & Partial<Request<Item, string>>;
export {};
