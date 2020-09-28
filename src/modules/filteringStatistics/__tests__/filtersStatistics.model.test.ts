import { createFilteringStatistics } from '../filtersStatistics.model';
import * as fixtures from 'modules/__fixtures__/fixtures';

describe('createFilteringStatistics', () => {
    const filteringStatisticsDataBuilder = createFilteringStatistics(fixtures.filterConfigData)(fixtures.filterIdToMatchingItemIds);
    fixtures.itemToFilteringStatus.forEach( (filteredItemStatus, item) => {
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
    
    fixtures.filterConfigData.getAllFilterGroupIds().forEach(filterGroupId => {
        test(`Should give all the items id rejected by group "${filterGroupId}"`, () => {
            expect(filteringStatisticsData.getItemsIdsRejectedByOneGroup(filterGroupId)).toMatchSnapshot();
        });
    });

    fixtures.filterConfigData.getFilterIdsNotApplied().forEach(filterId => {
        test(`Should give all the FilteringStat by filter "${filterId}"`, () => {
            expect(filteringStatisticsData.getItemsIdsModifiedByFilter(filterId)).toMatchSnapshot();
        });
    });
});


