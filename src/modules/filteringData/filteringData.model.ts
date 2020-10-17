import { FilterGroupId, FilterId } from 'modules/filterConfiguration'
import { FilteredItemStatus } from 'modules/filteringStatus'
import { FilterConfigData } from 'modules/filterConfiguration'
import { findIntersectionOfSortedArrays } from 'helpers/array.util'

type ItemId = string | number;

export interface FilterIdToMatchingItemIds {
    [key: string]: ItemId[];
}

export type FilteringStat = {
    type: 'added' | 'narrowed',
    itemIds: ItemId[]
}

export interface FilteringData {
    getItemsIdsModifiedByFilter: (filterId: FilterId) => FilteringStat,
    getItemsIdsRejectedByOneGroup: (groupId: FilterGroupId) => ItemId[],
    getItemsIdsRejectedByMultipleFilters: () => ItemId[],
    getItemsIdsValidated: () => ItemId[],
}

type ItemIdsByFilteringStatus = Map<FilterGroupId | boolean, ItemId[]>;

export const createFilteringData = 
    (filterConfigData: FilterConfigData) =>
    (filterIdToMatchingItemIds: FilterIdToMatchingItemIds) => {
        const initMapStructure = (): ItemIdsByFilteringStatus => {
            const itemIdsByFilteringStatus: ItemIdsByFilteringStatus = new Map();
            itemIdsByFilteringStatus
                .set(true, [])
                .set(false, []);

            return itemIdsByFilteringStatus;
        };

        const addItemIdToBoolean = (hasPassed: boolean, id: ItemId) => {
            const itemIds = itemIdsByFilteringStatus.get(hasPassed) as ItemId[];
            itemIds.push(id);      
        };

        const addItemIdToRejectedGroup = (group: FilterGroupId, id: ItemId) => {
            const listForGroup = itemIdsByFilteringStatus.get(group);
            listForGroup 
                ? listForGroup.push(id)
                : itemIdsByFilteringStatus.set(group, [id]);
        };

        const itemIdsByFilteringStatus = initMapStructure();

        return {
            addFilteredObjectStatus(filteredItemStatus: FilteredItemStatus, itemId: ItemId) {
                return (
                    filteredItemStatus.pass 
                        ? addItemIdToBoolean(true, itemId) :
                    filteredItemStatus.filterGroupRejected 
                        ? addItemIdToRejectedGroup(filteredItemStatus.filterGroupRejected, itemId) 
                        : addItemIdToBoolean(false, itemId)
                );
            },

            setStatusValue(filteredItemStatus: FilteredItemStatus, idList: ItemId[]) {
                filteredItemStatus.filterGroupRejected 
                    ? itemIdsByFilteringStatus.set(filteredItemStatus.filterGroupRejected, idList) 
                    : itemIdsByFilteringStatus.set(filteredItemStatus.pass, idList);

                return this;
            },

            done(): FilteringData {
                return getFilteringData(filterConfigData)(filterIdToMatchingItemIds)(itemIdsByFilteringStatus);
            }
        };
    };


const getFilteringData = 
    (filterConfigData: FilterConfigData) =>
    (filterIdToMatchingItemIds: FilterIdToMatchingItemIds) =>
    (itemIdsByFilteringStatus: ItemIdsByFilteringStatus): FilteringData => {

        /**
         * If 1 filter of the group has been checked, we are in this case:
         * the filter will actually add some new items since the logical operation is an OR with the other filters in the group
         */
        const getItemIdsAddedByFilter = (filterId: FilterId, filterGroupId: FilterGroupId): FilteringStat => {
            const itemsIdsRejectedByFilterGroup = itemIdsByFilteringStatus.get(filterGroupId) as ItemId[];
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
            const itemIdsValidated = itemIdsByFilteringStatus.get(true) as ItemId[];
            const itemIdsLeftIfFilterIsChecked = findIntersectionOfSortedArrays(itemIdsMatchingFilterId)(itemIdsValidated);

            return {
                type: 'narrowed',
                itemIds: itemIdsLeftIfFilterIsChecked,
            }
        }


        const getItemsIdsModifiedByFilter = (filterId: FilterId): FilteringStat => {
            const filterGroupId = filterConfigData.getGroupIdForFilter(filterId);
            return itemIdsByFilteringStatus.get(filterGroupId) === undefined 
                ? getItemIdsNarrowedByFilter(filterId)
                : getItemIdsAddedByFilter(filterId, filterGroupId)
        }

        return {
            getItemsIdsModifiedByFilter,
            getItemsIdsRejectedByOneGroup: (filterGroupId: FilterGroupId) => itemIdsByFilteringStatus.get(filterGroupId) ?? [],
            getItemsIdsRejectedByMultipleFilters: () => itemIdsByFilteringStatus.get(false) ?? [],
            getItemsIdsValidated: () => itemIdsByFilteringStatus.get(true) ?? [],
        }
    }
