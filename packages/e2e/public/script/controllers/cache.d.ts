import { EitherAsync } from 'purify-ts/EitherAsync';
import { FilteringData } from '../modules/filteringData';
import { FilterConfigData } from '../modules/filterConfiguration';
import { QueryRequest } from './models/';
export declare const setCachedFilteringData: <T>(request: QueryRequest<T, string>) => (filterConfigData: FilterConfigData<T, string>) => (filteringData: FilteringData) => EitherAsync<Error, void>;
export declare const getCachedFilteringData: <T>(request: QueryRequest<T, string>) => EitherAsync<Error, FilteringData>;
