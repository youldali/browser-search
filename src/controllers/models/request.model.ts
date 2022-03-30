import { FilterConfig, FiltersApplied } from '../../modules/filterConfiguration';

export type DocumentId = ItemKey;
export type StoreId = string;
export type OrderDirection = 'ASC' | 'DESC';
export { 
    FiltersApplied,
    FilterConfig,
    GroupOfFilters,
    Filter,
} from '../../modules/filterConfiguration'

export interface Request<T, TFilterId extends string = string> {
    storeId: StoreId;
    filterConfig: FilterConfig<T, TFilterId>;
	filtersApplied: FiltersApplied<TFilterId>;
	orderBy?: string;
	orderDirection?: OrderDirection;
    page?: number;
    perPage?: number;
};