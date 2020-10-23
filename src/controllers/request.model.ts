import { 
    FiltersApplied,
    FilterConfig,
} from 'modules/filterConfiguration'

export type ItemId = StringOrNumber;
export type Item = Object;
export type StoreId = string;


export interface Request {
    filterConfig: FilterConfig
	filtersApplied: FiltersApplied,
	orderBy: string,
    page: number,
    storeId: StoreId,
};