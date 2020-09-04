import { Operators } from './operators'
import { Interval } from 'dataStructures/interval'
import { isNil, mergeAll, reject } from 'rambda';

/**
 * FilterConfig ::
 * Describes the JSON representation of the filter configuration used as a base to create filtering functions
 * Example:
 * [ // FilterConfig
 *   [ // GroupOfFilters
 *     { id: 'priceMin', field: 'price', operator: '>', operand: 200 }, // Filter
 *     { id: 'priceMax', field: 'price', operator: '<', operand: 500}
 *   ],
 *   [
 *     { id: 'numberOfPeople' field: 'people', operator: '==', operand: 3 }
 *   ]
 * ]
 */

export type FilterGroup = string;
export type FilterId = string;
export type FilterOperand = number | string | number[] | string[] | Interval;
export interface Filter {
	id: string,
	field: string,
	operator: Operators,
	operand: FilterOperand,
};
export type GroupOfFilters = Filter[];
export type FilterConfig = GroupOfFilters[];
export type FiltersApplied = FilterId[];
export type FiltersByGroup = Dictionary<GroupOfFilters>; //key is FilterGroup

export interface FilterConfigData {
	getFilterDictionary: () => Dictionary<Filter>,
	getFiltersApplied: () => Filter[],
	getFiltersByGroup: () => FiltersByGroup,
}

const filterConfigToFilterDictionary = (filterConfig: FilterConfig): Dictionary<Filter> => {
	const groupOfFiltersReducer = (filterDictionary: Dictionary<Filter>, currentFilter: Filter): Dictionary<Filter> => {
		filterDictionary[currentFilter.id] = currentFilter;
		return filterDictionary;
	}

	const filterDictionary: Dictionary<Filter> = mergeAll(
		filterConfig.map(groupOfFilters => groupOfFilters.reduce(groupOfFiltersReducer, {}))
	);
	return filterDictionary;
}


export const buildFilterConfigData = (filterConfig: FilterConfig) =>
(filterIdsApplied: FiltersApplied): FilterConfigData => {
	const filterDictionary = filterConfigToFilterDictionary(filterConfig);
	const filtersApplied = reject(
		isNil,
		filterIdsApplied.map( filterId => filterDictionary[filterId] )
	);
	const filtersByGroup = filterConfig.reduce(
		(filtersByGroupDictionary, groupOfFilters, index) => {
			filtersByGroupDictionary[index.toString()] = groupOfFilters;
			return filtersByGroupDictionary;
		},
		{} as FiltersByGroup
	);

	return {
		getFilterDictionary: () => filterDictionary,
		getFiltersApplied: () => filtersApplied,
		getFiltersByGroup: () => filtersByGroup,
	}
}

