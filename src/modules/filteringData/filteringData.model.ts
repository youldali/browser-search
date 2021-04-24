import { GroupId, FilterId } from 'modules/filterConfiguration'
import { FilteredItemStatus } from 'modules/filteringStatus'
import { FilterConfigData } from 'modules/filterConfiguration'
import { findIntersectionOfSortedArrays } from 'helpers/array.util'

type ItemId = string | number;

export interface FilterIdToMatchingItemIds {
    [key: string]: ItemId[]; // key is FilterId
}

export type FilteringStat = {
    type: 'added' | 'narrowed',
    itemIds: ItemId[]
}

export interface FilteringData {
    getFilteringStatsByNonAppliedFilterId: () => Dictionary<FilteringStat>
    getFilteringStatForFilterId: (filterId: FilterId) => FilteringStat,
    getItemsIdsRejectedByGroupId: (groupId: GroupId) => ItemId[],
    getItemsIdsRejectedByMultipleFilters: () => ItemId[],
    getItemsIdsValidated: () => ItemId[],
}

type FilteringStatusToItemIds = Map<GroupId | boolean, ItemId[]>;

export const createFilteringData = 
    <T>(filterConfigData: FilterConfigData<T>) =>
    (filterIdToMatchingItemIds: FilterIdToMatchingItemIds) => {
        const initMapStructure = (): FilteringStatusToItemIds => {
            const filteringStatusToItemIds: FilteringStatusToItemIds = new Map();
            filteringStatusToItemIds
                .set(true, [])
                .set(false, []);

            return filteringStatusToItemIds;
        };

        const addItemIdToBoolean = (hasPassed: boolean, id: ItemId) => {
            const itemIds = filteringStatusToItemIds.get(hasPassed) as ItemId[];
            itemIds.push(id);      
        };

        const addItemIdToRejectedGroup = (group: GroupId, id: ItemId) => {
            const listForGroup = filteringStatusToItemIds.get(group);
            listForGroup 
                ? listForGroup.push(id)
                : filteringStatusToItemIds.set(group, [id]);
        };

        const filteringStatusToItemIds = initMapStructure();

        return {
            addFilteredObjectStatus(filteredItemStatus: FilteredItemStatus, itemId: ItemId): void {
                return (
                    filteredItemStatus.pass 
                        ? addItemIdToBoolean(true, itemId) :
                    filteredItemStatus.filterGroupRejected 
                        ? addItemIdToRejectedGroup(filteredItemStatus.filterGroupRejected, itemId) 
                        : addItemIdToBoolean(false, itemId)
                );
            },

            setStatusValue(filteredItemStatus: FilteredItemStatus, idList: ItemId[]): void {
                filteredItemStatus.filterGroupRejected 
                    ? filteringStatusToItemIds.set(filteredItemStatus.filterGroupRejected, idList) 
                    : filteringStatusToItemIds.set(filteredItemStatus.pass, idList);
            },

            done(): FilteringData {
                return getFilteringData(filterConfigData)(filterIdToMatchingItemIds)(filteringStatusToItemIds);
            }
        };
    };


const getFilteringData = 
    <T>(filterConfigData: FilterConfigData<T>) =>
    (filterIdToMatchingItemIds: FilterIdToMatchingItemIds) =>
    (filteringStatusToItemIds: FilteringStatusToItemIds): FilteringData => {

        /**
         * If 1 filter of the group has been checked, we are in this case:
         * the filter will actually add some new items since the logical operation is an OR with the other filters in the group
         */
        const getItemIdsAddedByFilter = (filterId: FilterId, groupId: GroupId): FilteringStat => {
            const itemsIdsRejectedByFilterGroup = filteringStatusToItemIds.get(groupId) as ItemId[];
            const itemIdsMatchingFilterId = filterIdToMatchingItemIds[filterId]; 
            const itemIdsAddedIfFilterIsChecked = findIntersectionOfSortedArrays(itemIdsMatchingFilterId)(itemsIdsRejectedByFilterGroup);

            return {
                type: 'added',
                itemIds: itemIdsAddedIfFilterIsChecked,
            }
        }

        /**
         * If 0 filter of the group has been checked, we are in this case:
         * the filter will narrow the list of items since the logical operation is an AND with the rest of the filters
         */
        const getItemIdsNarrowedByFilter = (filterId: FilterId): FilteringStat => {
            const itemIdsMatchingFilterId = filterIdToMatchingItemIds[filterId];
            const itemIdsValidated = filteringStatusToItemIds.get(true) as ItemId[];
            const itemIdsLeftIfFilterIsChecked = findIntersectionOfSortedArrays(itemIdsMatchingFilterId)(itemIdsValidated);

            return {
                type: 'narrowed',
                itemIds: itemIdsLeftIfFilterIsChecked,
            }
        }


        const getFilteringStatForFilterId = (filterId: FilterId): FilteringStat => {
            const groupId = filterConfigData.getGroupIdForFilter(filterId);
            return filteringStatusToItemIds.get(groupId) === undefined 
                ? getItemIdsNarrowedByFilter(filterId)
                : getItemIdsAddedByFilter(filterId, groupId)
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
            getItemsIdsRejectedByGroupId: (groupId: GroupId) => filteringStatusToItemIds.get(groupId) ?? [],
            getItemsIdsRejectedByMultipleFilters: () => filteringStatusToItemIds.get(false) ?? [],
            getItemsIdsValidated: () => filteringStatusToItemIds.get(true) ?? [],
        }
    }
