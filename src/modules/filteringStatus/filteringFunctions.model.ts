import { compose, sort } from 'ramda';
import { 
	Filter, 
	GroupId,
	FilterConfigData,
	Operators,
	operatorToFunction,
} from 'modules/filterConfiguration';

export type FilterFunction<T> = (target: T) => boolean;
export type FilterFunctionsCollections<T> = FilterFunction<T>[][];
export type GroupIdToFilterFunctions<T> = Dictionary<FilterFunction<T>[]>;
export type FilterFunctionsToGroupId<T> = Map<FilterFunction<T>[], GroupId>

export interface FilteringFunctionsData<T> {
	getFilterFunctionsFromGroup: (group: GroupId) => FilterFunction<T>[],
	getGroupIdFromFilterFunctions: (filterFunctions: FilterFunction<T>[]) => string | undefined,
	getFilterFunctionsCollections: () => FilterFunctionsCollections<T>,
}

export const getFilteringFunctionsData = <T>(filterConfigData: FilterConfigData<T>): FilteringFunctionsData<T> => {
	const appliedFilters = filterConfigData.getFiltersApplied();
	const filterDataBuilder = createFilterDataBuilder<T>();

	appliedFilters.forEach(filter => {
		const filterFunction = evaluateCriteria(filter);
		const groupId = filterConfigData.getGroupIdForFilter(filter.id);

		filterDataBuilder.addFilterFunction(filterFunction, groupId);
	});

	return filterDataBuilder.done();
};

const createFilterDataBuilder = <T>() => {
	const groupIdToFilterFunctions: GroupIdToFilterFunctions<T> = {};
	const	filterFunctionsToGroupId: FilterFunctionsToGroupId<T> = new Map();
	const	groupIds: GroupId[] = [];

	const	addFilterFunctionToNewGroup = (filterFunction: FilterFunction<T>, groupId: GroupId) => {
		const functionCollection = [filterFunction];
		groupIdToFilterFunctions[groupId] = functionCollection;
		filterFunctionsToGroupId.set(functionCollection, groupId);
		groupIds.push(groupId);
	};

	const	saveFilterFunctionIntoGroup = (filterFunction: FilterFunction<T>, group: GroupId) => groupIdToFilterFunctions[group].push(filterFunction);

	return {
		addFilterFunction(filterFunction: FilterFunction<T>, groupId: GroupId) {
			groupIdToFilterFunctions[groupId] 
			? saveFilterFunctionIntoGroup(filterFunction, groupId) 
			: addFilterFunctionToNewGroup(filterFunction, groupId);
			
			return this;
		},

		done(): FilteringFunctionsData<T> {
			/**
			 * We sort the function collection by length so that the groups with the least "OR" functions get matched first to optimize performance
			 */
			const sorterByLength = (a: any[], b: any[]) => a.length - b.length;
			const filterFunctionsCollections: FilterFunctionsCollections<T> = compose(
						sort(sorterByLength), 
						Object.values
					)(groupIdToFilterFunctions);

			return {
				getFilterFunctionsFromGroup: (group: GroupId) => groupIdToFilterFunctions[group],
				getGroupIdFromFilterFunctions: (filterFunctions: FilterFunction<T>[]) => filterFunctionsToGroupId.get(filterFunctions),
				getFilterFunctionsCollections: () => filterFunctionsCollections,
			}
		}
	};
};

const evaluateCriteria = 
	<T>(filter: Filter<T>) => 
	(target: T): boolean => {
		const { field, operand, operator } = filter;
		const operatorFunction = operatorToFunction[Operators[operator]]
		return target[field] !== undefined && operatorFunction(target[field], operand);
	};