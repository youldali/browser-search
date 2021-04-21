import { 
    FiltersApplied,
    FilterConfig,
} from 'modules/filterConfiguration'

export type ItemId = StringOrNumber;
export type Item = Object;
export type StoreId = string;
export type OrderDirection = 'ASC' | 'DESC';

export interface Request<T> {
    storeId: StoreId;
    filterConfig: FilterConfig<T>;
	filtersApplied: FiltersApplied;
	orderBy?: string;
	orderDirection?: OrderDirection;
    page?: number;
    perPage?: number;
};