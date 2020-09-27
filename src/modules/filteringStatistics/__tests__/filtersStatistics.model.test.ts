import { createFilteringStatistics } from '../filtersStatistics.model';
import { dataToFilterStatus } from 'modules/__fixtures__/filteringStatus.fixture';
import { filterConfigData } from 'modules/__fixtures__/filterConfig.fixture';
import { filterIdToMatchingItemIds } from 'modules/__fixtures__/filterStatistics.fixture';

describe('createFilteringStatistics', () => {
    const filteringStatisticsDataBuilder = createFilteringStatistics(filterConfigData)(filterIdToMatchingItemIds);
    dataToFilterStatus.forEach( (filteredItemStatus, item) => {
            filteringStatisticsDataBuilder.addFilteredObjectStatus(filteredItemStatus, item.id)
        }
    );
    const filteringStatisticsData = filteringStatisticsDataBuilder.done();

	test('Should give all the items id validated', () => {
        expect(filteringStatisticsData.getItemsIdsValidated()).toMatchSnapshot();
    });
    
    test('Should give all the items id rejected', () => {
        expect(filteringStatisticsData.getItemsIdsRejectedByMultipleFilters()).toMatchSnapshot();
    });
    
    filterConfigData.getAllFilterGroupIds().forEach(filterGroupId => {
        test(`Should give all the items id rejected by group "${filterGroupId}"`, () => {
            expect(filteringStatisticsData.getItemsIdsRejectedByOneGroup(filterGroupId)).toMatchSnapshot();
        });
    });

    filterConfigData.getFilterIdsNotApplied().forEach(filterId => {
        test(`Should give all the FilteringStat by filter "${filterId}"`, () => {
            expect(filteringStatisticsData.getItemsIdsModifiedByFilter(filterId)).toMatchSnapshot();
        });
    });
});


