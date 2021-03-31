import { compose, sort } from 'ramda';
import { 
	Filter, 
	FilterGroupId,
	FilterConfigData,
	Operators,
	operatorToFunction,
} from 'modules/filterConfiguration';

export type FilterFunction = (target: Object) => boolean;
export type FilterFunctionsCollection = FilterFunction[][];
export type FilterGroupToFilterFunctions = Dictionary<FilterFunction[]>;
export type FilterFunctionsToFilterGroup = Map<FilterFunction[], FilterGroupId>

export interface FilteringFunctionsData {
	getFilterFunctionsFromFilterGroup: (filterGroup: FilterGroupId) => FilterFunction[],
	getFilterGroupFromFilterFunctions: (filterFunctions: FilterFunction[]) => string | undefined,
	getFilterFunctionsCollection: () => FilterFunctionsCollection,
}

export type ObjectFiltered = Dictionary<any>

export const getFilteringFunctionsData = (filterConfigData: FilterConfigData): FilteringFunctionsData => {
	const appliedFilters = filterConfigData.getFiltersApplied();
	const filterDataBuilder = createFilterDataBuilder();

	appliedFilters.forEach(filter => {
		const filterFunction = evaluateCriteria(filter);
		const filterGroup = filterConfigData.getGroupIdForFilter(filter.id);

		filterDataBuilder.addFilterFunction(filterFunction, filterGroup);
	});

	return filterDataBuilder.getFilteringData();
};

const evaluateCriteria = 
	(filter: Filter) => 
	(target: ObjectFiltered): boolean => {
		const { field, operand, operator } = filter;
		const operatorFunction = operatorToFunction[Operators[operator]]
		return target[field] !== undefined && operatorFunction(target[field], operand);
	};

interface FilterDataParams {
    filterGroups: FilterGroupId[],
    filterGroupToFilterFunctions: FilterGroupToFilterFunctions,
    filterFunctionsToFilterGroup: FilterFunctionsToFilterGroup
    filterFunctionsCollection: FilterFunctionsCollection,
};

const buildFilterData = (filterParams: FilterDataParams): FilteringFunctionsData => {
    const getFilterFunctionsFromFilterGroup = (filterGroup: FilterGroupId) => filterParams.filterGroupToFilterFunctions[filterGroup];
    const getFilterGroupFromFilterFunctions = (filterFunctions: FilterFunction[]) => filterParams.filterFunctionsToFilterGroup.get(filterFunctions);
    const getFilterFunctionsCollection = () => filterParams.filterFunctionsCollection;

    return {
        getFilterFunctionsFromFilterGroup,
        getFilterGroupFromFilterFunctions,
        getFilterFunctionsCollection,
    }
};

const createFilterDataBuilder = () => {
	const 
		filterGroupToFilterFunctions: FilterGroupToFilterFunctions = {},
		filterFunctionsToFilterGroup: FilterFunctionsToFilterGroup = new Map(),
		filterGroups: FilterGroupId[] = [],

		addFilterFunctionToNewGroup = (filterFunction: FilterFunction, filterGroup: FilterGroupId) => {
			const filterGroupFunctionCollection = [filterFunction];
			filterGroupToFilterFunctions[filterGroup] = filterGroupFunctionCollection;
			filterFunctionsToFilterGroup.set(filterGroupFunctionCollection, filterGroup);
			filterGroups.push(filterGroup);
		},
		saveFilterFunctionIntoGroup = (filterFunction: FilterFunction, filterGroup: FilterGroupId) => filterGroupToFilterFunctions[filterGroup].push(filterFunction);

	return {
		addFilterFunction(filterFunction: FilterFunction, filterGroup: FilterGroupId) {
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
