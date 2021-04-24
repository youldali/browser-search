import { createFilteringData } from '../filteringData.model';
import { filterConfigDataFixture, filterIdToMatchingItemIdsFixture, itemToFilteringStatusFixture } from './__fixtures__/fixtures';

describe('createFilteringData', () => {
    const filteringStatisticsDataBuilder = createFilteringData(filterConfigDataFixture)(filterIdToMatchingItemIdsFixture);
    itemToFilteringStatusFixture.forEach( (filteredItemStatus, item) => {
            filteringStatisticsDataBuilder.addFilteredObjectStatus(filteredItemStatus, item.id)
        }
    );
    const filteringStatisticsData = filteringStatisticsDataBuilder.done();

	test('Should give all the items id validated', () => {
        expect(filteringStatisticsData.getItemsIdsValidated()).toMatchSnapshot();
    });
    
    test('Should give all the items id rejected by multiple filters', () => {
        expect(filteringStatisticsData.getItemsIdsRejectedByMultipleFilters()).toMatchSnapshot();
    });

    test('Should give a dictionary of FilteringStat by filter non applied', () => {
        expect(filteringStatisticsData.getFilteringStatsByNonAppliedFilterId()).toMatchSnapshot();
    });
    
    filterConfigDataFixture.getAllFilterGroupIds().forEach(filterGroupId => {
        test(`Should give all the items id rejected by group "${filterGroupId}"`, () => {
            expect(filteringStatisticsData.getItemsIdsRejectedByGroupId(filterGroupId)).toMatchSnapshot();
        });
    });

    filterConfigDataFixture.getFilterIdsNotApplied().forEach(filterId => {
        test(`Should give all the FilteringStat by filter "${filterId}"`, () => {
            expect(filteringStatisticsData.getFilteringStatForFilterId(filterId)).toMatchSnapshot();
        });
    });
});


