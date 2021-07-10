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
export interface Filter<T, TFilterId extends string = string> {
	id: TFilterId,
	field: keyof T,
	operator: Operator,
	operand: FilterOperand,
};
export type GroupOfFilters<T, TFilterId extends string = string> = Filter<T, TFilterId>[];
export type FilterConfig<T, TFilterId extends string = string>  = GroupOfFilters<T, TFilterId>[];
export type FiltersApplied<TFilterId extends string = string> = TFilterId[];
export type GroupDictionary<T, TFilterId extends string = string>  = Record<GroupId, GroupOfFilters<T, TFilterId> >;
export type FilterIdToGroupId = Map<FilterId, GroupId>; 

export interface FilterConfigData<T, TFilterId extends string = string> {
	getFilterDictionary: () => Record<TFilterId, Filter<T, TFilterId>>,
	getFiltersApplied: () => Filter<T, TFilterId> [],
	getFiltersNotApplied: () => Filter<T, TFilterId> [],
	getAllFilterIds: () => TFilterId[],
	getFilterIdsApplied: () => Partial<TFilterId>[],
	getFilterIdsNotApplied: () => Partial<TFilterId>[],
	getGroupDictionary: () => GroupDictionary<T, TFilterId> ,
	getAllFilterGroupIds: () => GroupId[],
	getGroupIdsApplied: () => GroupId[],
	getGroupIdForFilter: (filterId: FilterId) => GroupId,
}

export const buildFilterConfigData = 
	<T, TFilterId extends string = string>(filterConfig: FilterConfig<T, TFilterId>) =>
	(filterIdsApplied: TFilterId[]): FilterConfigData<T, TFilterId> => {
		const filterData = getFilterData(filterConfig)(filterIdsApplied);
		const groupData = getGroupData(filterConfig);
		const groupDictionaryFromFiltersApplied = filterData.uniqueFilterIdsApplied.reduce((groupDictionary: Record<GroupId, GroupId>, filterId: FilterId): Record<GroupId, GroupId> => {
			const group = groupData.filterToGroup.get(filterId);
			if(group) {
				groupDictionary[group] = group;
			}
			return groupDictionary;
		}, {});

		const groupIdsApplied = Object.values(groupDictionaryFromFiltersApplied);

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
	<T, TFilterId extends string = string>(filterConfig: FilterConfig<T, TFilterId>): Record<TFilterId, Filter<T, TFilterId>> => {
		const groupOfFiltersToDictionary = (filterDictionary: Record<TFilterId, Filter<T, TFilterId>>, currentFilter: Filter<T, TFilterId>): Record<TFilterId, Filter<T, TFilterId>> => {
			filterDictionary[currentFilter.id] = currentFilter;
			return filterDictionary;
		}

		const filterDictionary = mergeAll(
			filterConfig.map(groupOfFilters => groupOfFilters.reduce(groupOfFiltersToDictionary, {} as Record<TFilterId, Filter<T, TFilterId>>))
		);

		return filterDictionary;
}

const getFilterData = 
	<T, TFilterId extends string = string>(filterConfig: FilterConfig<T, TFilterId>) =>
	(filterIdsApplied: TFilterId[]) => {
	const filterDictionary = getFilterConfigToFilterDictionary(filterConfig);
	const allFilterIds = Object.values<Filter<T, TFilterId>>(filterDictionary).map(filter=> filter.id);
	const filterIdsNotApplied = reject(
		((filterId: TFilterId) => filterIdsApplied.includes(filterId)),
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
	<T, TFilterId extends string = string>(filterConfig: FilterConfig<T, TFilterId>) => {
	
	const groupDictionary = filterConfig.reduce(
		(filtersByGroupDictionary: GroupDictionary<T, TFilterId>, groupOfFilters, index) => {
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