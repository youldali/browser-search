import { EitherAsync } from 'purify-ts/EitherAsync';
import { FilterConfigData } from 'modules/filterConfiguration';
import { FilteringData } from 'modules/filteringData';
import { StoreId } from './models';
export declare const getFilteringData: <T>(storeId: StoreId) => (filterConfigData: FilterConfigData<T, string>) => EitherAsync<Error, FilteringData>;
