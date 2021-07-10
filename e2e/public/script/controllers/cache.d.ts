import { FilteringData } from '../modules/filteringData';
import { FilterConfigData } from '../modules/filterConfiguration';
import { Request } from './models/';
import { EitherAsync } from 'purify-ts/EitherAsync';
export declare const setCachedFilteringData: <T>(request: Request<T, string>) => (filterConfigData: FilterConfigData<T, string>) => (filteringData: FilteringData) => EitherAsync<Error, void>;
export declare const getCachedFilteringData: <T>(request: Request<T, string>) => EitherAsync<Error, FilteringData>;
