import { GroupId, FilterId } from 'modules/filterConfiguration';
import { FilteredItemStatus } from 'modules/filteringStatus';
import { FilterConfigData } from 'modules/filterConfiguration';
declare type DocumentId = StringOrNumber;
export interface FilterIdToMatchingDocumentIds {
    [key: string]: DocumentId[];
}
export declare type NextFilterState = {
    type: 'added' | 'narrowed';
    documentIds: DocumentId[];
};
export interface FilteringData {
    getNextFilterStatesForNonAppliedFilterId: () => Dictionary<NextFilterState>;
    getNextFilterStateForFilterId: (filterId: FilterId) => NextFilterState;
    getDocumentsIdsRejectedByGroupId: (groupId: GroupId) => DocumentId[];
    getDocumentsIdsRejectedByMultipleFilters: () => DocumentId[];
    getDocumentsIdsValidated: () => DocumentId[];
}
export declare const createFilteringData: <T>(filterConfigData: FilterConfigData<T>) => (filterIdToMatchingDocumentIds: FilterIdToMatchingDocumentIds) => {
    addFilteredObjectStatus(filteredItemStatus: FilteredItemStatus, documentId: DocumentId): void;
    setStatusValue(filteredItemStatus: FilteredItemStatus, idList: DocumentId[]): void;
    done(): FilteringData;
};
export {};
