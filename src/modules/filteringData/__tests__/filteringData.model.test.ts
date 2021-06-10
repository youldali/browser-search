import { createFilteringData } from '../filteringData.model';
import { filterConfigDataFixture, filterIdToMatchingDocumentIdsFixture, itemToFilteringStatusFixture } from './__fixtures__/fixtures';

describe('createFilteringData', () => {
    const filteringStatisticsDataBuilder = createFilteringData(filterConfigDataFixture)(filterIdToMatchingDocumentIdsFixture);
    itemToFilteringStatusFixture.forEach( (filteredDocumenttatus, item) => {
            filteringStatisticsDataBuilder.addFilteredObjectStatus(filteredDocumenttatus, item.id)
        }
    );
    const filteringStatisticsData = filteringStatisticsDataBuilder.done();

	test('Should give all the document id validated', () => {
        expect(filteringStatisticsData.getDocumentsIdsValidated()).toMatchSnapshot();
    });
    
    test('Should give all the document id rejected by multiple filters', () => {
        expect(filteringStatisticsData.getDocumentsIdsRejectedByMultipleFilters()).toMatchSnapshot();
    });

    test('Should give a dictionary of FilteringStat by filter non applied', () => {
        expect(filteringStatisticsData.getNextFilterStatesForNonAppliedFilterId()).toMatchSnapshot();
    });
    
    filterConfigDataFixture.getAllFilterGroupIds().forEach(filterGroupId => {
        test(`Should give all the document id rejected by group "${filterGroupId}"`, () => {
            expect(filteringStatisticsData.getDocumentsIdsRejectedByGroupId(filterGroupId)).toMatchSnapshot();
        });
    });

    filterConfigDataFixture.getFilterIdsNotApplied().forEach(filterId => {
        test(`Should give all the FilteringStat by filter "${filterId}"`, () => {
            expect(filteringStatisticsData.getNextFilterStateForFilterId(filterId)).toMatchSnapshot();
        });
    });
});


