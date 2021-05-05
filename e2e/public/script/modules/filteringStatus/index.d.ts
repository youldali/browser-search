import { FilterConfigData } from 'modules/filterConfiguration';
import { FilteredItemStatus } from './filteringStatus.model';
export { FilteredItemStatus, } from './filteringStatus.model';
export { FilterFunction, FilterFunctionsCollections, GroupIdToFilterFunctions, FilterFunctionsToGroupId, } from './filteringFunctions.model';
export declare const getFilterStatusFromFilterConfig: <T>(filterConfigData: FilterConfigData<T>) => (target: T) => FilteredItemStatus;
