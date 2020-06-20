export type FilterFunction = (target: Object) => boolean;
export type FilterFunctionListMappedToFilterGroup = Map<FilterFunction[], FilterGroup>;
export interface FilteredBoxStatus {
	readonly pass: boolean,
	readonly filterGroupRejected?: FilterGroup
};
export type FilterGroup = string;
export type FilterFunctionListByGroup = Array<FilterFunction[]>;

//import type { FilteredBoxStatus, FilterGroup, FilterFunction, FilterFunctionListByGroup, FilterFunctionListMappedToFilterGroup } from '../types';

/**
 ** filters an object for a group filter with || operator
 */
const filterObjectAgainstFilterGroup = 
(filterFunctionList: FilterFunction[]) => (target: Object): boolean => 
(function evaluateNextFilterFunction(iterator: Iterator<FilterFunction>): boolean{
	const currentIteratorState = iterator.next();
		if(currentIteratorState.done)
			return false;

	//eval the current criteria and ask for eval of the next one
	const filterFunction = currentIteratorState.value;
	return filterFunction(target) || evaluateNextFilterFunction(iterator);

})(filterFunctionList[Symbol.iterator]());

/**
 * Returns a filter function
 */

const filterObjectAgainstFilterFunctionListByGroup = 
(filterFunctionListByGroup: FilterFunctionListByGroup) =>
(filterFunctionListMappedToFilterGroup: FilterFunctionListMappedToFilterGroup) =>
(target: Object) => 
(function* evaluateNextGroupOfFilterFunction(iterator: Iterator<FilterFunction[]>): Generator<FilteredBoxStatus, void, Iterator<FilterFunction[]>>{
	const currentIteratorState = iterator.next();
	if(currentIteratorState.done){
		yield {pass: true};
		return;
	}

	//eval the current criteria and ask for eval of the next one
	const filterFunctionListForGroup = currentIteratorState.value;
	if(!filterObjectAgainstFilterGroup(filterFunctionListForGroup)(target))
		yield {pass: false, filterGroupRejected: filterFunctionListMappedToFilterGroup.get(filterFunctionListForGroup)};
	
	// @ts-ignore: downlevel iteration
	yield* evaluateNextGroupOfFilterFunction(iterator);

})(filterFunctionListByGroup[Symbol.iterator]());


const getFilterStatusForItem = 
(filterFunctionListByGroup: FilterFunctionListByGroup) =>
(filterFunctionListMappedToFilterGroup: FilterFunctionListMappedToFilterGroup) =>
(target: Object): FilteredBoxStatus =>
{
	const iteratorOnFilter = filterObjectAgainstFilterFunctionListByGroup(filterFunctionListByGroup)(filterFunctionListMappedToFilterGroup)(target);
	const filteringStatus = iteratorOnFilter.next().value || {pass: true};
	const filteringStatus2 = iteratorOnFilter.next().value;

	//case 1: the object pass => we return the 1st iteration {pass: true}
	//case 2: the object is rejected by 1 filter only: we return the first iteration {pass:false, filterGroupRejected: FilterGroup}
	//case 3: the object is rejected by 2 filters: we return {pass: false};
	return ( filteringStatus.pass || (filteringStatus2 && filteringStatus2.pass) 
			? filteringStatus
			: {pass: false} 
	);

};

export default getFilterStatusForItem;