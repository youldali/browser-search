import { FilterConfigData } from 'modules/filterConfiguration';
import { getFilteringFunctionsData } from './filteringFunctions.model';
import { getFilterStatusForItem } from './filteringStatus.model';

export {
    FilteredItemStatus,
} from './filteringStatus.model';

export {
    FilterFunction,
    FilterFunctionsCollection,
    FilterGroupToFilterFunctions,
    FilterFunctionsToFilterGroup,
} from './filteringFunctions.model';

export const getFilterStatusFromFilterConfig = 
(filterConfigData: FilterConfigData) => {
    const filteringFunctionsData = getFilteringFunctionsData(filterConfigData);
    return getFilterStatusForItem(filteringFunctionsData);
}
