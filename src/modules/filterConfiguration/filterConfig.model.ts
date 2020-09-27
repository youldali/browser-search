import { Operators } from './operators'
import { Interval } from 'dataStructures/interval'
import { isNil, mergeAll, reject } from 'rambda';

/**
 * FilterConfig ::
 * Describes the JSON representation of the filter configuration used as a base to create filtering functions
 * Example:
 * [ // FilterConfig
 *   [ // GroupOfFilters
 *     { id: 'priceMin', field: 'price', operator: 'lg', operand: 200 }, // Filter
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

export type FilterGroupId = string;
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
export type FilterToGroup = Map<FilterId, FilterGroupId>; 

export interface FilterConfigData {
	getFilterDictionary: () => Dictionary<Filter>,
	getFiltersApplied: () => Filter[],
	getFiltersNotApplied: () => Filter[],
	getAllFilterIds: () => FilterId[],
	getFilterIdsApplied: () => FilterId[],
	getFilterIdsNotApplied: () => FilterId[],
	getFiltersByGroup: () => FiltersByGroup,
	getAllFilterGroupIds: () => FilterGroupId[],
	getGroupIdForFilter: (filterId: FilterId) => FilterGroupId,
}

const filterConfigToFilterDictionary = 
	(filterConfig: FilterConfig): Dictionary<Filter> => {
		const groupOfFiltersReducer = (filterDictionary: Dictionary<Filter>, currentFilter: Filter): Dictionary<Filter> => {
			filterDictionary[currentFilter.id] = currentFilter;
			return filterDictionary;
		}

		const filterDictionary: Dictionary<Filter> = mergeAll(
			filterConfig.map(groupOfFilters => groupOfFilters.reduce(groupOfFiltersReducer, {}))
		);
		return filterDictionary;
	}


export const buildFilterConfigData = 
	(filterConfig: FilterConfig) =>
	(filterIdsApplied: FiltersApplied): FilterConfigData => {
		const filterDictionary = filterConfigToFilterDictionary(filterConfig);

		const allFilterIds = Object.values(filterDictionary).map(filter => filter.id);

		const filterIdsNotApplied = reject(
			(filterId => filterIdsApplied.includes(filterId)),
			allFilterIds
		);

		const filtersNotApplied = filterIdsNotApplied.map(filterId => filterDictionary[filterId]);

		const filtersApplied = reject(
			isNil,
			filterIdsApplied.map( filterId => filterDictionary[filterId] )
		);

		const filterIdsAppliedVerified = filtersApplied.map( filter => filter.id);

		const filtersByGroup = filterConfig.reduce(
			(filtersByGroupDictionary, groupOfFilters, index) => {
				filtersByGroupDictionary[index.toString()] = groupOfFilters;
				return filtersByGroupDictionary;
			},
			{} as FiltersByGroup
		);

		const allFilterGroupIds = Object.keys(filtersByGroup);

		const filterToGroup = filterConfig.reduce(
			(filterToGroup, groupOfFilters, index) => {
				groupOfFilters.forEach(filter => filterToGroup.set(filter.id, index.toString()))
				return filterToGroup;
			},
			new Map() as FilterToGroup
		);

		return {
			getAllFilterIds: () => allFilterIds,
			getFilterDictionary: () => filterDictionary,
			getFiltersApplied: () => filtersApplied,
			getFiltersNotApplied: () => filtersNotApplied,
			getFilterIdsApplied: () => filterIdsAppliedVerified,
			getFilterIdsNotApplied: () => filterIdsNotApplied,
			getFiltersByGroup: () => filtersByGroup,
			getAllFilterGroupIds: () => allFilterGroupIds,
			getGroupIdForFilter: (filterId: FilterId) => filterToGroup.get(filterId) || 'default',
		}
	}

