//@flow
import operators from 'helpers/misc/operators';
import { compose, concat, curry, mapObjIndexed, sort } from 'ramda';

import type { FilterName, FilterGroup, FilterFunction, FilterOperand, FilterStructure, FilterStructureMap, FiltersApplied, FiltersFunctionsData, FilterTuple } from '../types';

/**
 * evaluate a single criteria
 */

const _evaluateCriteria = 
(filterStructure: FilterStructure, filterValue: FilterOperand, target: Object): boolean => {
	const {field, operator} = filterStructure;
	return target[field] !== undefined && operators[operator](target[field], filterValue);
};
export const evaluateCriteria = curry(_evaluateCriteria);



//store filters functions according to group
//return a sorted filter function collection
export
const createFilterFunctionDataStructure = () => {
	const 
		filtersFunctionsMappedToFilterGroup: {[string]: FilterFunction[]} = {},
		noGroupFilterFunctionList: Array<FilterFunction[]> = [],
		filterFunctionListMappedToFilterGroup = new Map(),
		filterGroupList = [],

		addFilterFunctionToNoGroupList = (filterFunction: FilterFunction) => noGroupFilterFunctionList.push([filterFunction]),

		addFilterFunctionToNewGroup = (filterFunction: FilterFunction, filterGroup: FilterGroup) => {
			const filterGroupFunctionCollection = [filterFunction];
			filtersFunctionsMappedToFilterGroup[filterGroup] = filterGroupFunctionCollection;
			filterFunctionListMappedToFilterGroup.set(filterGroupFunctionCollection, filterGroup);
			filterGroupList.push(filterGroup);
		},

		saveFilterFunctionIntoGroup = (filterFunction: FilterFunction, filterGroup: FilterGroup) => filtersFunctionsMappedToFilterGroup[filterGroup].push(filterFunction);

	return {
		addFilterFunction(filterFunction: FilterFunction, filterGroup: ?FilterGroup){
			!filterGroup 
				? addFilterFunctionToNoGroupList(filterFunction) :
			filtersFunctionsMappedToFilterGroup[filterGroup] 
				? saveFilterFunctionIntoGroup(filterFunction, filterGroup) : addFilterFunctionToNewGroup(filterFunction, filterGroup)
			
			return this;
		},

		getFilteringData(): FiltersFunctionsData {
			const 
				sorterByLength = (a, b) => a.length - b.length,
				sortedFilterFunctionCollectionBelongingToGroup = compose(sort(sorterByLength), Object.values)(filtersFunctionsMappedToFilterGroup),
				filterFunctionListByGroup = concat(noGroupFilterFunctionList, sortedFilterFunctionCollectionBelongingToGroup);

			return {
				filterFunctionListByGroup,
				filterFunctionListMappedToFilterGroup,
				filterGroupList,
			}
		}
	};
};


const _getFilterFunctionsData = 
(filterStructureMap: FilterStructureMap, filtersApplied: FiltersApplied): FiltersFunctionsData => {

	const 
		getFilteringDataFromFiltersTuples = (filtersTuples: [FilterTuple]): FiltersFunctionsData => {
			const reducer = (filterFunctionDataStructure, [filterName, filterFunction]) => {
				const { filterGroup } = filterStructureMap[filterName];
				return filterFunctionDataStructure.addFilterFunction(filterFunction, filterGroup);
			};

			const filterFunctionCollectionStructure = filtersTuples.reduce(reducer, createFilterFunctionDataStructure());
			return filterFunctionCollectionStructure.getFilteringData();
		},

		getFilterFunctionFromAppliedFilter = (filterOperand: FilterOperand, filterName: FilterName): FilterFunction => evaluateCriteria(filterStructureMap[filterName], filterOperand);


	const 
		mGetFilterFunctionFromAppliedFilter = mapObjIndexed(getFilterFunctionFromAppliedFilter),
		filterData = compose(getFilteringDataFromFiltersTuples, Object.entries, mGetFilterFunctionFromAppliedFilter)(filtersApplied);

	return filterData;
};
export const getFilterFunctionsData = curry(_getFilterFunctionsData);

export default getFilterFunctionsData;