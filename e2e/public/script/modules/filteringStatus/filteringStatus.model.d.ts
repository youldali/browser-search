import { GroupId } from 'modules/filterConfiguration';
import { FilteringFunctionsData } from './filteringFunctions.model';
export interface FilteredItemStatus {
    readonly pass: boolean;
    readonly filterGroupRejected?: GroupId;
}
/**
 *
 * Receives a group of filtering functions and checks if the item passes the filtering
 * Returns a filterStatus (boolean) and if necessary, the filterGroup that rejected the item
 * The filterGroup is only mentioned if the item is rejected by ONE AND ONLY ONE group (for stats purposes)
 */
export declare const getFilterStatusForItem: <T>(filteringFunctionsData: FilteringFunctionsData<T>) => (target: T) => FilteredItemStatus;
