import { 
    buildFilterConfigData,
    Filter,
    FiltersApplied,
    FilterConfig,
    FilterConfigData 
} from 'modules/filterConfiguration'
import { getFilterStatusFromFilterConfig } from 'modules/filteringStatus';
import { createFilteringData, FilteringData, FilterIdToMatchingItemIds } from 'modules/filteringData';
import { getAllBoxesId, iterateOverBoxes } from '../services/idbStorageService';
import { filter, map } from 'rambda';
import { filterConfigData } from 'modules/__fixtures__/fixtures';
import { getPrimaryKeysMatchingOperator } from 'apis/storage.util';



export const getFilterStatitics = 
(filterConfigData: FilterConfigData) =>
(request: Request): FilteringData => {
    const getFilterStatus = getFilterStatusFromFilterConfig(filterConfigData);
    const filteringData = createFilteringData(filterConfigData)
}


const iterateOnItemCallback = (filterStatisticStructure: Object, getFilterStatusForItem: Function, itemId: BoxId, item: Box): void =>  {
    const status = getFilterStatusForItem(item);
    filterStatisticStructure.addFilteredObjectStatus(status, itemId);
};


const getFilterIdToMatchingItemIds = (storeName: string) => (filterConfigData: FilterConfigData): FilterIdToMatchingItemIds => {
    const filterDictionary = filterConfigData.getFilterDictionary();

    const getItemsIdsMatchingFilter = (filter: Filter) => getPrimaryKeysMatchingOperator('storename')(filter.field)(filter.operator)(filter.operand);

    map(filterDictionary)
}

