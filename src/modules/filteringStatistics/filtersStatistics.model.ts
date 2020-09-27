import { FilterGroupId, FilterId } from 'modules/filterConfiguration'
import { FilteredBoxStatus } from 'modules/filtering'
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

export interface FilteringStatisticsData {
    getItemsIdsModifiedByFilter: (filterId: FilterId) => FilteringStat,
    getItemsIdsRejectedByOneGroup: (groupId: FilterGroupId) => ItemId[],
    getItemsIdsRejectedByMultipleFilters: () => ItemId[],
    getItemsIdsValidated: () => ItemId[],
}

type ItemIdsByFilteringStatus = Map<FilterGroupId | boolean, ItemId[]>;

export const createFilteringStatistics = 
    (filterConfigData: FilterConfigData) =>
    (filterIdToMatchingItemIds: FilterIdToMatchingItemIds) => {
        const initMapStructure = (): ItemIdsByFilteringStatus => {
            const boxesIdMappedByFilteredStatus: ItemIdsByFilteringStatus = new Map();
            boxesIdMappedByFilteredStatus
                .set(true, [])
                .set(false, []);

            return boxesIdMappedByFilteredStatus;
        };

        const addItemIdToBoolean = (hasPassed: boolean, id: ItemId) => {
            const itemIds = boxesIdMappedByFilteredStatus.get(hasPassed) as ItemId[];
            itemIds.push(id);      
        };

        const addItemIdToRejectedGroup = (group: FilterGroupId, id: ItemId) => {
            const listForGroup = boxesIdMappedByFilteredStatus.get(group);
            listForGroup 
                ? listForGroup.push(id)
                : boxesIdMappedByFilteredStatus.set(group, [id]);
        };

        const boxesIdMappedByFilteredStatus = initMapStructure();

        return {
            addFilteredObjectStatus(filteredBoxStatus: FilteredBoxStatus, itemId: ItemId) {
                return (
                    filteredBoxStatus.pass 
                        ? addItemIdToBoolean(true, itemId) :
                    filteredBoxStatus.filterGroupRejected 
                        ? addItemIdToRejectedGroup(filteredBoxStatus.filterGroupRejected, itemId) 
                        : addItemIdToBoolean(false, itemId)
                );
            },

            setStatusValue(filteredBoxStatus: FilteredBoxStatus, idList: ItemId[]) {
                filteredBoxStatus.filterGroupRejected 
                    ? boxesIdMappedByFilteredStatus.set(filteredBoxStatus.filterGroupRejected, idList) 
                    : boxesIdMappedByFilteredStatus.set(filteredBoxStatus.pass, idList);

                return this;
            },

            done(): FilteringStatisticsData {
                return getFilteringStatistics(filterConfigData)(filterIdToMatchingItemIds)(boxesIdMappedByFilteredStatus)
            }
        };
    };


const getFilteringStatistics = 
    (filterConfigData: FilterConfigData) =>
    (filterIdToMatchingItemIds: FilterIdToMatchingItemIds) =>
    (itemIdsByFilteringStatus: ItemIdsByFilteringStatus): FilteringStatisticsData => {

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
