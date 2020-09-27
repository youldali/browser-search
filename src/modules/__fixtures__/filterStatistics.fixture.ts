import { filterConfigData, filterDictionary } from './filterConfig.fixture';
import { itemToFilteringStatus } from './filteringStatus.fixture';
import { createFilteringStatistics, FilterIdToMatchingItemIds } from '../filteringStatistics';


export const filterIdToMatchingItemIds: FilterIdToMatchingItemIds = {
    [filterDictionary.priceMin.id]: [0, 1, 3],
    [filterDictionary.priceMax.id]: [0, 2, 4],
    [filterDictionary.numberOfPeople.id]: [1, 4],
    [filterDictionary['activity-1'].id]: [0, 1, 2],
    [filterDictionary['activity-2'].id]: [0, 1, 2],
    [filterDictionary['activity-3'].id]: [1, 3],
}

const filteringStatisticsDataBuilder = createFilteringStatistics(filterConfigData)(filterIdToMatchingItemIds);
itemToFilteringStatus.forEach( (filteredItemStatus, item) => {
        filteringStatisticsDataBuilder.addFilteredObjectStatus(filteredItemStatus, item.id)
    }
);
export const filteringStatisticsData = filteringStatisticsDataBuilder.done();
