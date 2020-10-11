import { 
    buildFilterConfigData,
    FiltersApplied,
    FilterConfig,
    FilterConfigData 
} from 'modules/filterConfiguration'
import { getFilterStatusFromFilterConfig } from 'modules/filteringStatus';
import { createFilteringData, FilteringData } from 'modules/filteringData';
import { getAllBoxesId, iterateOverBoxes } from '../services/idbStorageService';



export const getFilterStatitics = 
(filterConfigData: FilterConfigData) =>
(request: Request): FilteringData => {
    const getFilterStatus = getFilterStatusFromFilterConfig(filterConfigData);
    const 
}