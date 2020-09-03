import { compose, concat, sort } from 'rambda';

export type FilterGroup = string;
export type FilterFunction = (target: Object) => boolean;
export interface FilteredBoxStatus {
	readonly pass: boolean,
	readonly filterGroupRejected?: FilterGroup
};

type FilterFunctionsCollection = FilterFunction[][];
type FilterGroupToFilterFunctions = Dictionary<FilterFunction[]>;
type FilterFunctionsToFilterGroup = Map<FilterFunction[], FilterGroup>

export const createFilterDataBuilder = () => {
	const 
		filterGroupToFilterFunctions: FilterGroupToFilterFunctions = {},
		noGroupFilterFunctions: FilterFunction[][] = [],
		filterFunctionsToFilterGroup: FilterFunctionsToFilterGroup = new Map(),
		filterGroups: FilterGroup[] = [],

		addFilterFunctionToNoGroupList = (filterFunction: FilterFunction) => noGroupFilterFunctions.push([filterFunction]),
		addFilterFunctionToNewGroup = (filterFunction: FilterFunction, filterGroup: FilterGroup) => {
			const filterGroupFunctionCollection = [filterFunction];
			filterGroupToFilterFunctions[filterGroup] = filterGroupFunctionCollection;
			filterFunctionsToFilterGroup.set(filterGroupFunctionCollection, filterGroup);
			filterGroups.push(filterGroup);
		},
		saveFilterFunctionIntoGroup = (filterFunction: FilterFunction, filterGroup: FilterGroup) => filterGroupToFilterFunctions[filterGroup].push(filterFunction);

	return {
		addFilterFunction(filterFunction: FilterFunction, filterGroup?: FilterGroup) {
			!filterGroup ? addFilterFunctionToNoGroupList(filterFunction) :
			filterGroupToFilterFunctions[filterGroup] ? saveFilterFunctionIntoGroup(filterFunction, filterGroup) : 
			addFilterFunctionToNewGroup(filterFunction, filterGroup);
			
			return this;
		},

		getFilteringData() {
			const 
				sorterByLength = (a: any[], b: any[]) => a.length - b.length,
				sortedFilterFunctionCollectionBelongingToGroup: FilterFunctionsCollection = compose(sort(sorterByLength), Object.values)(filterGroupToFilterFunctions),
				filterFunctionsCollection: FilterFunctionsCollection = concat(noGroupFilterFunctions, sortedFilterFunctionCollectionBelongingToGroup);

			return filterData({
                filterGroups,
                filterGroupToFilterFunctions,
                filterFunctionsToFilterGroup,
				filterFunctionsCollection,
			})
		}
	};
};

interface FilterDataParams {
    filterGroups: FilterGroup[],
    filterGroupToFilterFunctions: FilterGroupToFilterFunctions,
    filterFunctionsToFilterGroup: FilterFunctionsToFilterGroup
    filterFunctionsCollection: FilterFunctionsCollection,
};

const filterData = (filterData: FilterDataParams) => {
    const getFilterFunctionsFromFilterGroup = (filterGroup: FilterGroup) => filterData.filterGroupToFilterFunctions[filterGroup];
    const getFilterGroupFromFilterFunctions = (filterFunctions: FilterFunction[]) => filterData.filterFunctionsToFilterGroup.get(filterFunctions);
    const getFilterFunctionsCollection = () => filterData.filterFunctionsCollection;

    return {
        getFilterFunctionsFromFilterGroup,
        getFilterGroupFromFilterFunctions,
        getFilterFunctionsCollection,
    }
};

export type FilterData = typeof filterData;
