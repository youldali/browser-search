import { FilteringData } from '../modules/filteringData';
import { FilterConfigData } from '../modules/filterConfiguration';
import { Request } from './models/';
import { EitherAsync } from 'purify-ts/EitherAsync';
export declare const setCachedFilteringData: <T>(request: Request<T>) => (filterConfigData: FilterConfigData<T>) => (filteringData: FilteringData) => EitherAsync<Error, void>;
export declare const getCachedFilteringData: <T>(request: Request<T>) => EitherAsync<Error, FilteringData>;
