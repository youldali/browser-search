import { EitherAsync } from 'purify-ts/EitherAsync'
import { FilterConfigData } from 'modules/filterConfiguration'
import { getFilterStatusFromFilterConfig, FilteredItemStatus } from 'modules/filteringStatus';
import { createFilteringData, FilteringData, FilterIdToMatchingDocumentIds } from 'modules/filteringData';
import { fromPairs, zip } from 'ramda';
import { getPrimaryKeysMatchingOperator, iterateOverStore } from 'apis/storage.util';
import { DocumentId, StoreId } from './models';



export const getFilterStatitics = 
<T>(storeId: StoreId) =>
(filterConfigData: FilterConfigData<T>): EitherAsync<Error, FilteringData> => {
    const getFilterStatus = getFilterStatusFromFilterConfig(filterConfigData);

    const saveItemFilterStatus = 
        (saveStatus: (filteredItemStatus: FilteredItemStatus, documentId: DocumentId) => void) => 
        (documentId: DocumentId, document: T): void =>  {
            const status = getFilterStatus(document);
            saveStatus(status, documentId);
        };

    const eitherFilteringData = 
        getFilterIdToMatchingDocumentIds(storeId)(filterConfigData)
        .map(createFilteringData(filterConfigData))
        .chain(filteringData => (
            iterateOverStore<T>(storeId)(saveItemFilterStatus(filteringData.addFilteredObjectStatus))
                .map(_ => filteringData.done())
        ))

    return eitherFilteringData;
}



const getFilterIdToMatchingDocumentIds = (storeName: string) => <T>(filterConfigData: FilterConfigData<T>): EitherAsync<Error, FilterIdToMatchingDocumentIds> => {
    const filters = Object.values(filterConfigData.getFilterDictionary());
    const filtersIds = filterConfigData.getAllFilterIds();

    const eitherAsyncItemsIdsMatchingFiltersList = EitherAsync.sequence( 
        filters.map( filter => getPrimaryKeysMatchingOperator(storeName)(filter.field as string)(filter.operator)(filter.operand) )
    );
   
    const eitherAsyncItemsIdsMatchingFilters = 
        eitherAsyncItemsIdsMatchingFiltersList.map( itemsIdsMatchingFilters => (
            fromPairs(zip(filtersIds, itemsIdsMatchingFilters))
        ));

    return eitherAsyncItemsIdsMatchingFilters;
}

