import { EitherAsync } from 'purify-ts/EitherAsync';
import { FilterConfigData } from 'modules/filterConfiguration';
import { FilteringData } from 'modules/filteringData';
import { StoreId } from './request.model';
export declare const getFilterStatitics: <T>(storeId: StoreId) => (filterConfigData: FilterConfigData<T>) => EitherAsync<Error, FilteringData>;