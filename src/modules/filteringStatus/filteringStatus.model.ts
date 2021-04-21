import { GroupId,} from 'modules/filterConfiguration';
import { 
	FilterFunction, 
	FilteringFunctionsData,
} from './filteringFunctions.model';

export interface FilteredItemStatus {
	readonly pass: boolean,
	readonly filterGroupRejected?: GroupId
};

/**
 * 
 * Receives a group of filtering functions and checks if the item passes the filtering
 * Returns a filterStatus (boolean) and if necessary, the filterGroup that rejected the item
 * The filterGroup is only mentioned if the item is rejected by ONE AND ONLY ONE group (for stats purposes)
 */
export const getFilterStatusForItem = 
<T>(filteringFunctionsData: FilteringFunctionsData<T>) =>
(target: T): FilteredItemStatus =>
{
	const iteratorOnFilter = (
		function* evaluateNextGroupOfFilterFunctions(iterator: Iterator<FilterFunction<T>[]>): 
			// @ts-ignore: downlevel iteration
			Generator<FilteredItemStatus, FilteredItemStatus | undefined, Iterator<FilterFunction<T>[]>> {
				const filterFunctionsCollectionsIteratorResult = iterator.next();

				// all filtering functions have passed
				if(filterFunctionsCollectionsIteratorResult.done){
					yield { pass: true };
					return { pass: true };
				};
	
			const filterFunctions = filterFunctionsCollectionsIteratorResult.value;

			if(!filterObjectAgainstFilterFunctions(filterFunctions)(target))
				yield {pass: false, filterGroupRejected: filteringFunctionsData.getGroupIdFromFilterFunctions(filterFunctions)};
			
			yield* evaluateNextGroupOfFilterFunctions(iterator);
		}
	)(filteringFunctionsData.getFilterFunctionsCollections()[Symbol.iterator]());

	const filteringStatus = iteratorOnFilter.next().value ?? { pass: true };
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

/**
 * Receives a group of filters represented by an array of boolean functions
 * Filters an object against the group of filter using || operator
 * Returns true if object passes at least one of the filters
 */
 const filterObjectAgainstFilterFunctions = 
 <T>(filterFunctionList: FilterFunction<T>[]) => (target: T): boolean => 
 (function evaluateNextFilterFunction(iterator: Iterator<FilterFunction<T>>): boolean{
	 const filterFunctionsIteratorResult = iterator.next();
		 if(filterFunctionsIteratorResult.done)
			 return false; // mempty for || operator
 
	 const filterFunction = filterFunctionsIteratorResult.value;
	 return filterFunction(target) || evaluateNextFilterFunction(iterator);
 
 })(filterFunctionList[Symbol.iterator]());