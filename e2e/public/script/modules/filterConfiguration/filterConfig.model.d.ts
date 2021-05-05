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
export interface Filter<T> {
    id: string;
    field: keyof T;
    operator: Operator;
    operand: FilterOperand;
}
export declare type GroupOfFilters<T> = Filter<T>[];
export declare type FilterConfig<T> = GroupOfFilters<T>[];
export declare type FiltersApplied = FilterId[];
export declare type GroupDictionary<T> = Dictionary<GroupOfFilters<T>>;
export declare type FilterIdToGroupId = Map<FilterId, GroupId>;
export interface FilterConfigData<T> {
    getFilterDictionary: () => Dictionary<Filter<T>>;
    getFiltersApplied: () => Filter<T>[];
    getFiltersNotApplied: () => Filter<T>[];
    getAllFilterIds: () => FilterId[];
    getFilterIdsApplied: () => FilterId[];
    getFilterIdsNotApplied: () => FilterId[];
    getGroupDictionary: () => GroupDictionary<T>;
    getAllFilterGroupIds: () => GroupId[];
    getGroupIdForFilter: (filterId: FilterId) => GroupId;
}
export declare const buildFilterConfigData: <T>(filterConfig: FilterConfig<T>) => (filterIdsApplied: FiltersApplied) => FilterConfigData<T>;
