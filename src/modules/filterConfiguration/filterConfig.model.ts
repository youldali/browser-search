import { Operator } from './operators'
import { Interval } from 'dataStructures/interval'
import { isNil, mergeAll, reject, uniq } from 'ramda';

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

export type GroupId = string;
export type FilterId = string;
export type FilterOperand = number | string | number[] | string[] | Interval;
export interface Filter<T> {
	id: string,
	field: keyof T,
	operator: Operator,
	operand: FilterOperand,
};
export type GroupOfFilters<T> = Filter<T>[];
export type FilterConfig<T>  = GroupOfFilters<T>[];
export type FiltersApplied = FilterId[];
export type GroupDictionary<T>  = Record<GroupId, GroupOfFilters<T> >;
export type FilterIdToGroupId = Map<FilterId, GroupId>; 

export interface FilterConfigData<T> {
	getFilterDictionary: () => Record<string, Filter<T>>,
	getFiltersApplied: () => Filter<T> [],
	getFiltersNotApplied: () => Filter<T> [],
	getAllFilterIds: () => FilterId[],
	getFilterIdsApplied: () => FilterId[],
	getFilterIdsNotApplied: () => FilterId[],
	getGroupDictionary: () => GroupDictionary<T> ,
	getAllFilterGroupIds: () => GroupId[],
	getGroupIdsApplied: () => GroupId[],
	getGroupIdForFilter: (filterId: FilterId) => GroupId,
}

export const buildFilterConfigData = 
	<T>(filterConfig: FilterConfig<T>) =>
	(filterIdsApplied: FiltersApplied): FilterConfigData<T> => {
		const filterData = getFilterData(filterConfig)(filterIdsApplied);
		const groupData = getGroupData(filterConfig);
		const groupDictionaryOfFiltersApplied = filterData.uniqueFilterIdsApplied.reduce((groupDictionary: Record<string, GroupId>, filterId: FilterId): Record<string, GroupId> => {
			const group = groupData.filterToGroup.get(filterId);
			if(group) {
				groupDictionary[group] = group;
			}
			return groupDictionary;
		}, {});

		const groupIdsApplied = Object.values(groupDictionaryOfFiltersApplied);

		return {
			getAllFilterIds: () => filterData.allFilterIds,
			getFilterDictionary: () => filterData.filterDictionary,
			getFiltersApplied: () => filterData.filtersApplied,
			getFiltersNotApplied: () => filterData.filtersNotApplied,
			getFilterIdsApplied: () => filterData.uniqueFilterIdsApplied,
			getFilterIdsNotApplied: () => filterData.filterIdsNotApplied,
			getGroupDictionary: () => groupData.groupDictionary,
			getAllFilterGroupIds: () => groupData.allFilterGroupIds,
			getGroupIdsApplied: () => groupIdsApplied,
			getGroupIdForFilter: (filterId: FilterId) => groupData.filterToGroup.get(filterId) ?? 'default',
		}
	}

const getFilterConfigToFilterDictionary = 
	<T>(filterConfig: FilterConfig<T>): Record<string, Filter<T>> => {
		const groupOfFiltersToDictionary = (filterDictionary: Record<string, Filter<T>>, currentFilter: Filter<T>): Record<string, Filter<T>> => {
			filterDictionary[currentFilter.id] = currentFilter;
			return filterDictionary;
		}

		const filterDictionary = mergeAll(
			filterConfig.map(groupOfFilters => groupOfFilters.reduce(groupOfFiltersToDictionary, {}))
		);

		return filterDictionary;
}

const getFilterData = 
	<T>(filterConfig: FilterConfig<T>) =>
	(filterIdsApplied: FiltersApplied) => {
	const filterDictionary = getFilterConfigToFilterDictionary(filterConfig);
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
	const uniqueFilterIdsApplied = uniq(filtersApplied.map(filter => filter.id));

	return {
		filterDictionary,
		filtersApplied,
		allFilterIds,
		filterIdsNotApplied,
		filtersNotApplied,
		uniqueFilterIdsApplied
	}
}

const getGroupData = 
	<T>(filterConfig: FilterConfig<T>) => {
	
	const groupDictionary = filterConfig.reduce(
		(filtersByGroupDictionary: GroupDictionary<T>, groupOfFilters, index) => {
			filtersByGroupDictionary[index.toString()] = groupOfFilters;
			return filtersByGroupDictionary;
		},
		{}
	);

	const allFilterGroupIds = Object.keys(groupDictionary);

	const filterToGroup = filterConfig.reduce(
		(filterToGroup: FilterIdToGroupId, groupOfFilters, index) => {
			groupOfFilters.forEach(filter => filterToGroup.set(filter.id, index.toString()))
			return filterToGroup;
		},
		new Map()
	);

	return {
		groupDictionary,
		allFilterGroupIds,
		filterToGroup,
	}
}