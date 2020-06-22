//@flow
import operators from 'helpers/misc/operators';
import { compose, concat, curry, mapObjIndexed, sort } from 'ramda';


export interface FilterStructure {
	filterName: FilterName,
	filterGroup?: FilterGroup,
	operator: Operator,
	field: string,
	operand: FilterOperand,
	label: string
};
export type FilterOperand = number | string | number[] | string[] | Interval;
export type Operator = 
    '<' | '<=' | '>' | '>=' | '==' | '===' | 
    'inRangeClosed' | 'inRangeOpen' | 'inRangeClosedOpen' | 'inRangeOpenClosed' |
    'isIncluded' | 'contains' | 'hasOneInCommon';

export type Interval = {'0': number, '1': number};
export type ObjectFiltered = Dictionary<any>
export type FilterGroup = string;
export type FilterFunction = (target: Object) => boolean;
export type FiltersFunctionsData = {
	filterFunctionListByGroup: FilterFunctionListByGroup, 
	filterFunctionListMappedToFilterGroup: FilterFunctionListMappedToFilterGroup,
	filterGroupList: FilterGroup[],
}
export type FilterFunctionListByGroup = Array<FilterFunction[]>;
export type FilterFunctionListMappedToFilterGroup = Map<FilterFunction[], FilterGroup>;
export interface FilterStructureMap { 
	[key: string]: FilterStructure 
};
export type FilterName = string;
export type FilterTuple = [FilterName, FilterFunction];
export interface FiltersApplied { [key: string]: FilterOperand};

const evaluateCriteria = 
(filterStructure: FilterStructure) => 
(filterValue: FilterOperand) => 
(target: ObjectFiltered): boolean => {
	const {field, operator} = filterStructure;
	return target[field] !== undefined && operators[operator](target[field], filterValue);
};


//store filters functions according to group
//return a sorted filter function collection
export
const createFilterFunctionDataStructure = () => {
	const 
		filtersFunctionsMappedToFilterGroup: {[key: string]: FilterFunction[]} = {},
		noGroupFilterFunctionList: Array<FilterFunction[]> = [],
		filterFunctionListMappedToFilterGroup = new Map(),
		filterGroupList: string[] = [],

		addFilterFunctionToNoGroupList = (filterFunction: FilterFunction) => noGroupFilterFunctionList.push([filterFunction]),

		addFilterFunctionToNewGroup = (filterFunction: FilterFunction, filterGroup: FilterGroup) => {
			const filterGroupFunctionCollection = [filterFunction];
			filtersFunctionsMappedToFilterGroup[filterGroup] = filterGroupFunctionCollection;
			filterFunctionListMappedToFilterGroup.set(filterGroupFunctionCollection, filterGroup);
			filterGroupList.push(filterGroup);
		},

		saveFilterFunctionIntoGroup = (filterFunction: FilterFunction, filterGroup: FilterGroup) => filtersFunctionsMappedToFilterGroup[filterGroup].push(filterFunction);

	return {
		addFilterFunction(filterFunction: FilterFunction, filterGroup?: FilterGroup){
			!filterGroup ? addFilterFunctionToNoGroupList(filterFunction) :
			filtersFunctionsMappedToFilterGroup[filterGroup] ? saveFilterFunctionIntoGroup(filterFunction, filterGroup) : 
			addFilterFunctionToNewGroup(filterFunction, filterGroup);
			
			return this;
		},

		getFilteringData(): FiltersFunctionsData {
			const 
				sorterByLength = (a: Array<unknown>, b: Array<unknown>) => a.length - b.length,
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
			const reducer = (filterFunctionDataStructure: any, [filterName, filterFunction] : [FilterName, FilterFunction]) => {
				const { filterGroup } = filterStructureMap[filterName];
				return filterFunctionDataStructure.addFilterFunction(filterFunction, filterGroup);
			};

			const filterFunctionCollectionStructure = filtersTuples.reduce(reducer, createFilterFunctionDataStructure());
			return filterFunctionCollectionStructure.getFilteringData();
		},

		getFilterFunctionFromAppliedFilter = (filterOperand: FilterOperand, filterName: FilterName): FilterFunction => evaluateCriteria(filterStructureMap[filterName])(filterOperand);


	const 
		mGetFilterFunctionFromAppliedFilter = mapObjIndexed(getFilterFunctionFromAppliedFilter),
		filterData = compose(getFilteringDataFromFiltersTuples, Object.entries, mGetFilterFunctionFromAppliedFilter)(filtersApplied);

	return filterData;
};
export const getFilterFunctionsData = curry(_getFilterFunctionsData);

export default getFilterFunctionsData;