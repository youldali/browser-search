import { FiltersApplied, FilterConfig } from '../../modules/filterConfiguration';
export declare type DocumentId = ItemKey;
export declare type StoreId = string;
export declare type OrderDirection = 'ASC' | 'DESC';
export { FiltersApplied, FilterConfig, } from '../../modules/filterConfiguration';
export interface Request<T, TFilterId extends string = string> {
    storeId: StoreId;
    filterConfig: FilterConfig<T, TFilterId>;
    filtersApplied: FiltersApplied<TFilterId>;
    orderBy?: string;
    orderDirection?: OrderDirection;
    page?: number;
    perPage?: number;
}
