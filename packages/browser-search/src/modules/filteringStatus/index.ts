import { FilterConfigData } from 'modules/filterConfiguration';
import { getFilteringFunctionsData } from './filteringFunctions.model';
import { getFilterStatusForItem, FilteredItemStatus } from './filteringStatus.model';

export {
    FilteredItemStatus,
} from './filteringStatus.model';

export {
    FilterFunction,
    FilterFunctionsCollections,
    GroupIdToFilterFunctions,
    FilterFunctionsToGroupId,
} from './filteringFunctions.model';

export const getFilterStatusFromFilterConfig = 
<T>(filterConfigData: FilterConfigData<T>): (target: T) => FilteredItemStatus => {
    const filteringFunctionsData = getFilteringFunctionsData(filterConfigData);
    return getFilterStatusForItem(filteringFunctionsData);
}
