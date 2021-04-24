import { EitherAsync } from 'purify-ts/EitherAsync'
import { FilterConfigData } from 'modules/filterConfiguration'
import { getFilterStatusFromFilterConfig, FilteredItemStatus } from 'modules/filteringStatus';
import { createFilteringData, FilteringData, FilterIdToMatchingItemIds } from 'modules/filteringData';
import { fromPairs, zip } from 'ramda';
import { getPrimaryKeysMatchingOperator, iterateOverStore } from 'apis/storage.util';
import { allEitherAsyncs } from 'helpers/purify.util';
import { StoreId } from './request.model';



export const getFilterStatitics = 
<T>(storeId: StoreId) =>
(filterConfigData: FilterConfigData<T>): EitherAsync<Error, FilteringData> => {
    const getFilterStatus = getFilterStatusFromFilterConfig(filterConfigData);

    const saveItemFilterStatus = 
        (saveStatus: (filteredItemStatus: FilteredItemStatus, itemId: StringOrNumber) => void) => 
        (itemId: StringOrNumber, item: T): void =>  {
            const status = getFilterStatus(item);
            saveStatus(status, itemId);
        };

    const eitherFilteringData = 
        getFilterIdToMatchingItemIds(storeId)(filterConfigData)
        .map(createFilteringData(filterConfigData))
        .chain(filteringData => (
            iterateOverStore<T>(storeId)(saveItemFilterStatus(filteringData.addFilteredObjectStatus))
                .map(_ => filteringData.done())
        ))

    return eitherFilteringData;
}



const getFilterIdToMatchingItemIds = (storeName: string) => <T>(filterConfigData: FilterConfigData<T>): EitherAsync<Error, FilterIdToMatchingItemIds> => {
    const filters = Object.values(filterConfigData.getFilterDictionary());
    const filtersIds = filterConfigData.getAllFilterIds();

    const eitherAsyncItemsIdsMatchingFiltersList = allEitherAsyncs( 
        filters.map( filter => getPrimaryKeysMatchingOperator(storeName)(filter.field as string)(filter.operator)(filter.operand) )
    );
   
    const eitherAsyncItemsIdsMatchingFilters = 
        eitherAsyncItemsIdsMatchingFiltersList.map( itemsIdsMatchingFilters => (
            fromPairs(zip(filtersIds, itemsIdsMatchingFilters))
        ));

    return eitherAsyncItemsIdsMatchingFilters;
}

