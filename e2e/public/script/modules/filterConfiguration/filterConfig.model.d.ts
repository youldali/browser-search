import { Operator } from './operators';
import { Interval } from 'dataStructures/interval';
/**
 * FilterConfig ::
 * Describes the JSON representation of the filter configuration used as a base to create filtering functions
 * Example:
 * [ // FilterConfig
 *   [ // GroupOfFilters
 *     { id: 'priceMin', field: 'price', operator: 'lt', operand: 200 }, // Filter
 *   ],
 * 	 [
 *     { id: 'priceMax', field: 'price', operator: 'gt', operand: 500}
 *   ]
 *   [
 *     { id: 'solo' field: 'people', operator: 'equals', operand: 1 }
 *     { id: 'forCouple' field: 'people', operator: 'equals', operand: 2 }
 *   ]
 * ]
 */
export declare type GroupId = string;
export declare type FilterId = string;
export declare type FilterOperand = number | string | number[] | string[] | Interval;
export interface Filter<T, TFilterId extends string = string> {
    id: TFilterId;
    field: keyof T;
    operator: Operator;
    operand: FilterOperand;
}
export declare type GroupOfFilters<T, TFilterId extends string = string> = Filter<T, TFilterId>[];
export declare type FilterConfig<T, TFilterId extends string = string> = GroupOfFilters<T, TFilterId>[];
export declare type FiltersApplied<TFilterId extends string = string> = TFilterId[];
export declare type GroupDictionary<T, TFilterId extends string = string> = Record<GroupId, GroupOfFilters<T, TFilterId>>;
export declare type FilterIdToGroupId = Map<FilterId, GroupId>;
export interface FilterConfigData<T, TFilterId extends string = string> {
    getFilterDictionary: () => Record<TFilterId, Filter<T, TFilterId>>;
    getFiltersApplied: () => Filter<T, TFilterId>[];
    getFiltersNotApplied: () => Filter<T, TFilterId>[];
    getAllFilterIds: () => TFilterId[];
    getFilterIdsApplied: () => Partial<TFilterId>[];
    getFilterIdsNotApplied: () => Partial<TFilterId>[];
    getGroupDictionary: () => GroupDictionary<T, TFilterId>;
    getAllFilterGroupIds: () => GroupId[];
    getGroupIdsApplied: () => GroupId[];
    getGroupIdForFilter: (filterId: FilterId) => GroupId;
}
export declare const buildFilterConfigData: <T, TFilterId extends string = string>(filterConfig: FilterConfig<T, TFilterId>) => (filterIdsApplied: TFilterId[]) => FilterConfigData<T, TFilterId>;
