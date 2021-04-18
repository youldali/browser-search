import { 
    FiltersApplied,
    FilterConfig,
} from 'modules/filterConfiguration'

export type ItemId = StringOrNumber;
export type Item = Object;
export type StoreId = string;


export interface Request {
    storeId: StoreId,
    filterConfig: FilterConfig
	filtersApplied: FiltersApplied,
	orderBy?: string,
	orderDirection?: 'ASC' | 'DESC',
    page?: number,
    perPage?: number,
};