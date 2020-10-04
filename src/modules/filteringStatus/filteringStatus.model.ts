import { FilterGroupId,} from 'modules/filterConfiguration';
import { 
	FilterFunction, 
	FilteringFunctionsData,
} from './filteringFunctions.model';

export interface FilteredItemStatus {
	readonly pass: boolean,
	readonly filterGroupRejected?: FilterGroupId
};

/**
 * Receives a group of filters represented by an array of boolean functions
 * Filters an object against the group of filter using || operator
 * Returns true if object passes at least one of the filters
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
 * Receives a group of filtering functions and checks if the item passes the filtering
 * Returns a filterStatus (boolean) and if necessary, the filterGroup that rejected the item
 * The filterGroup is only mentioned if the item is rejected by ONE AND ONLY ONE group (for stats purposes)
 */
export const getFilterStatusForItem = 
(filteringFunctionsData: FilteringFunctionsData) =>
(target: Object): FilteredItemStatus =>
{
	const iteratorOnFilter = (
		function* evaluateNextGroupOfFilterFunctions(iterator: Iterator<FilterFunction[]>): 
			Generator<FilteredItemStatus, any, Iterator<FilterFunction[]>> {
				const currentIteratorState = iterator.next();
				if(currentIteratorState.done){
					yield { pass: true };
					return;
				};
	
			const filterFunctionsForOneGroup = currentIteratorState.value;

			if(!filterObjectAgainstFilterGroup(filterFunctionsForOneGroup)(target))
				yield {pass: false, filterGroupRejected: filteringFunctionsData.getFilterGroupFromFilterFunctions(filterFunctionsForOneGroup)};
			
			// @ts-ignore: downlevel iteration
			yield* evaluateNextGroupOfFilterFunctions(iterator);
		}
	)(filteringFunctionsData.getFilterFunctionsCollection()[Symbol.iterator]());

	const filteringStatus = iteratorOnFilter.next().value || { pass: true };
	const filteringStatus2 = iteratorOnFilter.next().value;

	//case 1: the object pass => we return the 1st iteration {pass: true}
	//case 2: the object is rejected by 1 filter only: we return the first iteration {pass:false, filterGroupRejected: FilterGroup}
	//case 3: the object is rejected by 2 filters: we return {pass: false};
	return ( 
		filteringStatus.pass || (filteringStatus2?.pass) 
		? filteringStatus
		: { pass: false } 
	);
};
