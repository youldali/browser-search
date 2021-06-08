import { 
    FiltersApplied,
    FilterConfig,
} from '../../modules/filterConfiguration'

export type DocumentId = ItemKey;
export type StoreId = string;
export type OrderDirection = 'ASC' | 'DESC';
export { 
    FiltersApplied,
    FilterConfig,
} from '../../modules/filterConfiguration'

export interface Request<T> {
    storeId: StoreId;
    filterConfig: FilterConfig<T>;
	filtersApplied: FiltersApplied;
	orderBy?: string;
	orderDirection?: OrderDirection;
    page?: number;
    perPage?: number;
};