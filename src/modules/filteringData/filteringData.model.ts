import { GroupId, FilterId } from 'modules/filterConfiguration'
import { FilteredItemStatus } from 'modules/filteringStatus'
import { FilterConfigData } from 'modules/filterConfiguration'
import { findIntersectionOfSortedArrays } from 'helpers/array.util'

export type DocumentId = StringOrNumber;
export interface FilterIdToMatchingDocumentIds {
    [key: string]: DocumentId[]; // key is FilterId
}

export type NextFilterState = {
    type: 'added' | 'narrowed' | 'matching',
    documentIds: DocumentId[]
}

export interface FilteringData {
    getNextFilterStates: () => Dictionary<NextFilterState>,
    getNextFilterStateForFilterId: (filterId: FilterId) => NextFilterState,
    getDocumentsIdsRejectedByGroupId: (groupId: GroupId) => DocumentId[],
    getDocumentsIdsRejectedByMultipleFilters: () => DocumentId[],
    getDocumentsIdsValidated: () => DocumentId[],
}

type FilteringStatusToDocumentsIds = Map<GroupId | boolean, DocumentId[]>;

export const createFilteringData = 
    <T>(filterConfigData: FilterConfigData<T>) =>
    (filterIdToMatchingDocumentIds: FilterIdToMatchingDocumentIds) => {
        const initMapStructure = (): FilteringStatusToDocumentsIds => {
            const filteringStatusToDocumentsIds: FilteringStatusToDocumentsIds = new Map();
            filteringStatusToDocumentsIds
                .set(true, [])
                .set(false, []);
            return filteringStatusToDocumentsIds;
        };

        const addDocumentIdToBoolean = (hasPassed: boolean, id: DocumentId) => {
            const documentIds = filteringStatusToDocumentsIds.get(hasPassed) as DocumentId[];
            documentIds.push(id);      
        };

        const addDocumentIdToRejectedGroup = (group: GroupId, id: DocumentId) => {
            const listForGroup = filteringStatusToDocumentsIds.get(group);
            listForGroup 
                ? listForGroup.push(id)
                : filteringStatusToDocumentsIds.set(group, [id]);
        };

        const filteringStatusToDocumentsIds = initMapStructure();

        return {
            addFilteredObjectStatus(filteredItemStatus: FilteredItemStatus, documentId: DocumentId): void {
                return (
                    filteredItemStatus.pass 
                        ? addDocumentIdToBoolean(true, documentId) :
                    filteredItemStatus.filterGroupRejected 
                        ? addDocumentIdToRejectedGroup(filteredItemStatus.filterGroupRejected, documentId) 
                        : addDocumentIdToBoolean(false, documentId)
                );
            },

            setStatusValue(filteredItemStatus: FilteredItemStatus, idList: DocumentId[]): void {
                filteredItemStatus.filterGroupRejected 
                    ? filteringStatusToDocumentsIds.set(filteredItemStatus.filterGroupRejected, idList) 
                    : filteringStatusToDocumentsIds.set(filteredItemStatus.pass, idList);
            },

            done(): FilteringData {
                return getFilteringData(filterConfigData)(filterIdToMatchingDocumentIds)(filteringStatusToDocumentsIds);
            }
        };
    };


const getFilteringData = 
    <T>(filterConfigData: FilterConfigData<T>) =>
    (filterIdToMatchingDocumentIds: FilterIdToMatchingDocumentIds) =>
    (filteringStatusToDocumentsIds: FilteringStatusToDocumentsIds): FilteringData => {

        /**
         * If 1 filter of the group has been checked, we are in this case:
         * the filter will actually add some new items since the logical operation is an OR with the other filters in the group
         */
        const getDocumentIdsAddedByFilter = (filterId: FilterId, groupId: GroupId): NextFilterState => {
            const documentIdsRejectedByFilterGroup = filteringStatusToDocumentsIds.get(groupId) ?? [];
            const documentIdsMatchingFilterId = filterIdToMatchingDocumentIds[filterId]; 
            const documentIdsAddedIfFilterIsChecked = findIntersectionOfSortedArrays(documentIdsMatchingFilterId)(documentIdsRejectedByFilterGroup);

            return {
                type: 'added',
                documentIds: documentIdsAddedIfFilterIsChecked,
            }
        }

        /**
         * If 0 filter of the group has been checked, we are in this case:
         * the filter will narrow the list of items since the logical operation is an AND with the rest of the filters
         */
        const getDocumentIdsNarrowedByFilter = (filterId: FilterId): NextFilterState => {
            const documentIdsMatchingFilterId = filterIdToMatchingDocumentIds[filterId];
            const documentIdsValidated = filteringStatusToDocumentsIds.get(true) as DocumentId[];
            const documentIdsLeftIfFilterIsChecked = findIntersectionOfSortedArrays(documentIdsMatchingFilterId)(documentIdsValidated);

            return {
                type: 'narrowed',
                documentIds: documentIdsLeftIfFilterIsChecked,
            }
        }

        const getDocumentIdsMatchingFilter = (filterId: FilterId): NextFilterState => {
            const documentIdsMatchingFilterId = filterIdToMatchingDocumentIds[filterId];
            const documentIdsValidated = filteringStatusToDocumentsIds.get(true) as DocumentId[];
            const documentIdsMatchingFilter = findIntersectionOfSortedArrays(documentIdsMatchingFilterId)(documentIdsValidated);

            return {
                type: 'matching',
                documentIds: documentIdsMatchingFilter,
            }
        }

        const getNextFilterStateForFilterId = (filterId: FilterId): NextFilterState => {
            const groupId = filterConfigData.getGroupIdForFilter(filterId);
            const isFilterApplied = filterConfigData.getFilterIdsApplied().includes(filterId);
            const isGroupApplied = filterConfigData.getGroupIdsApplied().includes(groupId);
            return (
                isFilterApplied ? 
                getDocumentIdsMatchingFilter(filterId) 
                : isGroupApplied
                ? getDocumentIdsAddedByFilter(filterId, groupId)
                : getDocumentIdsNarrowedByFilter(filterId)
            );
        }

        const getNextFilterStates = (): Dictionary<NextFilterState> => {
            const filterIds = filterConfigData.getAllFilterIds();
            const filteringStatsByFilterId = filterIds.reduce((nextFilterStateDictionary: Dictionary<NextFilterState>, filterId) => {
                const filteringStat = getNextFilterStateForFilterId(filterId);
                nextFilterStateDictionary[filterId] = filteringStat;
                return nextFilterStateDictionary;
            }, {});

            return filteringStatsByFilterId;
        }

        return {
            getNextFilterStates,
            getNextFilterStateForFilterId,
            getDocumentsIdsRejectedByGroupId: (groupId: GroupId) => filteringStatusToDocumentsIds.get(groupId) ?? [],
            getDocumentsIdsRejectedByMultipleFilters: () => filteringStatusToDocumentsIds.get(false) ?? [],
            getDocumentsIdsValidated: () => filteringStatusToDocumentsIds.get(true) ?? [],
        }
    }
