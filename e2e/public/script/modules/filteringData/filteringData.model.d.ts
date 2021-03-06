import { GroupId, FilterId } from 'modules/filterConfiguration';
import { FilteredItemStatus } from 'modules/filteringStatus';
import { FilterConfigData } from 'modules/filterConfiguration';
export declare type DocumentId = StringOrNumber;
export interface FilterIdToMatchingDocumentIds {
    [key: string]: DocumentId[];
}
export declare type NextFilterState = {
    type: 'added' | 'narrowed' | 'matching';
    documentIds: DocumentId[];
};
export interface FilteringData {
    getNextFilterStates: () => Record<string, NextFilterState>;
    getNextFilterStateForFilterId: (filterId: FilterId) => NextFilterState;
    getDocumentsIdsRejectedByGroupId: (groupId: GroupId) => DocumentId[];
    getDocumentsIdsRejectedByMultipleFilters: () => DocumentId[];
    getDocumentsIdsValidated: () => DocumentId[];
}
export declare const createFilteringData: <T>(filterConfigData: FilterConfigData<T, string>) => (filterIdToMatchingDocumentIds: FilterIdToMatchingDocumentIds) => {
    addFilteredObjectStatus(filteredItemStatus: FilteredItemStatus, documentId: DocumentId): void;
    setStatusValue(filteredItemStatus: FilteredItemStatus, idList: DocumentId[]): void;
    done(): FilteringData;
};
