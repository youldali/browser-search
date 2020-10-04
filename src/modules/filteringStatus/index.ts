import { FilterConfigData } from 'modules/filterConfiguration';
import { getFilteringFunctionsData } from './filteringFunctions.model';
import { getFilterStatusForItem } from './filteringStatus.model';

export {
    FilteredItemStatus,
} from './filteringStatus.model';

export const getFilterStatusFromFilterConfig = 
(filterConfigData: FilterConfigData) => {
    const filteringFunctionsData = getFilteringFunctionsData(filterConfigData);
    return getFilterStatusForItem(filteringFunctionsData)
}
