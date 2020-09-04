import { compose, sort } from 'rambda';

export type FilterGroup = string;
export type FilterFunction = (target: Object) => boolean;
export interface FilteredBoxStatus {
	readonly pass: boolean,
	readonly filterGroupRejected?: FilterGroup
};
export type FilterFunctionsCollection = FilterFunction[][];
export type FilterGroupToFilterFunctions = Dictionary<FilterFunction[]>;
export type FilterFunctionsToFilterGroup = Map<FilterFunction[], FilterGroup>

export interface FilterData {
	getFilterFunctionsFromFilterGroup: (filterGroup: FilterGroup) => FilterFunction[],
	getFilterGroupFromFilterFunctions: (filterFunctions: FilterFunction[]) => string | undefined,
	getFilterFunctionsCollection: () => FilterFunctionsCollection,
}

export const createFilterDataBuilder = () => {
	const 
		filterGroupToFilterFunctions: FilterGroupToFilterFunctions = {},
		filterFunctionsToFilterGroup: FilterFunctionsToFilterGroup = new Map(),
		filterGroups: FilterGroup[] = [],

		addFilterFunctionToNewGroup = (filterFunction: FilterFunction, filterGroup: FilterGroup) => {
			const filterGroupFunctionCollection = [filterFunction];
			filterGroupToFilterFunctions[filterGroup] = filterGroupFunctionCollection;
			filterFunctionsToFilterGroup.set(filterGroupFunctionCollection, filterGroup);
			filterGroups.push(filterGroup);
		},
		saveFilterFunctionIntoGroup = (filterFunction: FilterFunction, filterGroup: FilterGroup) => filterGroupToFilterFunctions[filterGroup].push(filterFunction);

	return {
		addFilterFunction(filterFunction: FilterFunction, filterGroup: FilterGroup) {
			filterGroupToFilterFunctions[filterGroup] ? saveFilterFunctionIntoGroup(filterFunction, filterGroup) : 
			addFilterFunctionToNewGroup(filterFunction, filterGroup);
			
			return this;
		},

		getFilteringData() {
			/**
			 * We sort the function collection by length so that the groups with the least "OR" functions get matched first to optimize
			 */
			const 
				sorterByLength = (a: any[], b: any[]) => a.length - b.length,
				filterFunctionsCollection: FilterFunctionsCollection = compose(
						sort(sorterByLength), 
						Object.values
					)(filterGroupToFilterFunctions);

			return buildFilterData({
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

const buildFilterData = (filterParams: FilterDataParams): FilterData => {
    const getFilterFunctionsFromFilterGroup = (filterGroup: FilterGroup) => filterParams.filterGroupToFilterFunctions[filterGroup];
    const getFilterGroupFromFilterFunctions = (filterFunctions: FilterFunction[]) => filterParams.filterFunctionsToFilterGroup.get(filterFunctions);
    const getFilterFunctionsCollection = () => filterParams.filterFunctionsCollection;

    return {
        getFilterFunctionsFromFilterGroup,
        getFilterGroupFromFilterFunctions,
        getFilterFunctionsCollection,
    }
};
