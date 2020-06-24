export type FilterFunction = (target: Object) => boolean;
export type FilterFunctionListMappedToFilterGroup = Map<FilterFunction[], FilterGroup>;
export interface FilteredBoxStatus {
	readonly pass: boolean,
	readonly filterGroupRejected?: FilterGroup
};
export type FilterGroup = string;
export type FilterFunctionListByGroup = Array<FilterFunction[]>;


/**
 * filters an object for a group filter with || operator
 */
const filterObjectAgainstFilterGroup = 
(filterFunctionList: FilterFunction[]) => (target: Object): boolean => 
(function evaluateNextFilterFunction(iterator: Iterator<FilterFunction>): boolean{
	const currentIteratorState = iterator.next();
		if(currentIteratorState.done)
			return false;

	const filterFunction = currentIteratorState.value;
	return filterFunction(target) || evaluateNextFilterFunction(iterator);

})(filterFunctionList[Symbol.iterator]());

/**
 * 
 * Receives a group of function which take an item and verifies if it passes the filtering
 * Returns a filterStatus (boolean) and if necessary, the filterGroup that rejected the item
 * The filterGroup is only mentioned if the item is rejected by ONE AND ONLY ONE group (for stats purposes)
 */
const getFilterStatusForItem = 
(filterFunctionListByGroup: FilterFunctionListByGroup) =>
(filterFunctionListMappedToFilterGroup: FilterFunctionListMappedToFilterGroup) =>
(target: Object): FilteredBoxStatus =>
{
	const iteratorOnFilter = (function* evaluateNextGroupOfFilterFunction(iterator: Iterator<FilterFunction[]>): Generator<FilteredBoxStatus, any, Iterator<FilterFunction[]>>{
		const currentIteratorState = iterator.next();
		if(currentIteratorState.done){
			yield {pass: true};
			return;
		}
	
		const filterFunctionListForGroup = currentIteratorState.value;
		if(!filterObjectAgainstFilterGroup(filterFunctionListForGroup)(target))
			yield {pass: false, filterGroupRejected: filterFunctionListMappedToFilterGroup.get(filterFunctionListForGroup)};
		
		// @ts-ignore: downlevel iteration
		yield* evaluateNextGroupOfFilterFunction(iterator);
	
	})(filterFunctionListByGroup[Symbol.iterator]());

	const filteringStatus = iteratorOnFilter.next().value || {pass: true};
	const filteringStatus2Thunk = iteratorOnFilter.next().value;

	//case 1: the object pass => we return the 1st iteration {pass: true}
	//case 2: the object is rejected by 1 filter only: we return the first iteration {pass:false, filterGroupRejected: FilterGroup}
	//case 3: the object is rejected by 2 filters: we return {pass: false};
	return ( 
		filteringStatus.pass || (filteringStatus2Thunk?.pass) 
		? filteringStatus
		: {pass: false} 
	);
};

export default getFilterStatusForItem;