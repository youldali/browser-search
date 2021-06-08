import { GroupId, FilterId } from 'modules/filterConfiguration'
import { FilteredItemStatus } from 'modules/filteringStatus'
import { FilterConfigData } from 'modules/filterConfiguration'
import { findIntersectionOfSortedArrays } from 'helpers/array.util'

type DocumentId = StringOrNumber;
export interface FilterIdToMatchingDocumentIds {
    [key: string]: DocumentId[]; // key is FilterId
}

export type FilteringStat = {
    type: 'added' | 'narrowed',
    documentIds: DocumentId[]
}

export interface FilteringData {
    getFilteringStatsByNonAppliedFilterId: () => Dictionary<FilteringStat>
    getFilteringStatForFilterId: (filterId: FilterId) => FilteringStat,
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
        const getDocumentIdsAddedByFilter = (filterId: FilterId, groupId: GroupId): FilteringStat => {
            const documentIdsRejectedByFilterGroup = filteringStatusToDocumentsIds.get(groupId) as DocumentId[];
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
        const getDocumentIdsNarrowedByFilter = (filterId: FilterId): FilteringStat => {
            const documentIdsMatchingFilterId = filterIdToMatchingDocumentIds[filterId];
            const documentIdsValidated = filteringStatusToDocumentsIds.get(true) as DocumentId[];
            const documentIdsLeftIfFilterIsChecked = findIntersectionOfSortedArrays(documentIdsMatchingFilterId)(documentIdsValidated);

            return {
                type: 'narrowed',
                documentIds: documentIdsLeftIfFilterIsChecked,
            }
        }


        const getFilteringStatForFilterId = (filterId: FilterId): FilteringStat => {
            const groupId = filterConfigData.getGroupIdForFilter(filterId);
            return filteringStatusToDocumentsIds.get(groupId) === undefined 
                ? getDocumentIdsNarrowedByFilter(filterId)
                : getDocumentIdsAddedByFilter(filterId, groupId)
        }

        const getFilteringStatsByNonAppliedFilterId = (): Dictionary<FilteringStat> => {
            const filterIdsNotApplied = filterConfigData.getFilterIdsNotApplied();
            const filteringStatsByNonAppliedFilterId = filterIdsNotApplied.reduce((filteringStatDictionary: Dictionary<FilteringStat>, filterId) => {
                const filteringStat = getFilteringStatForFilterId(filterId);
                filteringStatDictionary[filterId] = filteringStat;
                return filteringStatDictionary;
            }, {});

            return filteringStatsByNonAppliedFilterId;
        }

        return {
            getFilteringStatsByNonAppliedFilterId,
            getFilteringStatForFilterId,
            getDocumentsIdsRejectedByGroupId: (groupId: GroupId) => filteringStatusToDocumentsIds.get(groupId) ?? [],
            getDocumentsIdsRejectedByMultipleFilters: () => filteringStatusToDocumentsIds.get(false) ?? [],
            getDocumentsIdsValidated: () => filteringStatusToDocumentsIds.get(true) ?? [],
        }
    }
