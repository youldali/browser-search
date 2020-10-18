import { EitherAsync, liftPromise } from 'purify-ts/EitherAsync'
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
import { compose, filter, fromPairs, map, zip } from 'rambda';
import { filterConfigData } from 'modules/__fixtures__/fixtures';
import { getPrimaryKeysMatchingOperator } from 'apis/storage.util';
import { allEitherAsyncs } from 'helpers/purify.util';



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


const getFilterIdToMatchingItemIds = (storeName: string) => (filterConfigData: FilterConfigData): EitherAsync<Error, FilterIdToMatchingItemIds> => {
    const filters = Object.values(filterConfigData.getFilterDictionary());
    const filtersIds = filterConfigData.getAllFilterIds();

    const eitherAsyncItemsIdsMatchingFiltersList = allEitherAsyncs( 
        filters.map( filter => getPrimaryKeysMatchingOperator(storeName)(filter.field)(filter.operator)(filter.operand) )
    );
   
    const eitherAsyncItemsIdsMatchingFilters = 
        eitherAsyncItemsIdsMatchingFiltersList.map( itemsIdsMatchingFilters => (
            fromPairs(zip(filtersIds, itemsIdsMatchingFilters))
        ));

    return eitherAsyncItemsIdsMatchingFilters;
}

