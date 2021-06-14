import { createFilteringData } from '../filteringData.model';
import { serialize, deserialize } from '../serialize';
import { filterConfigDataFixture, filterIdToMatchingDocumentIdsFixture, itemToFilteringStatusFixture } from './__fixtures__/fixtures';

describe ('serialization', () => {
    const filteringStatisticsDataBuilder = createFilteringData(filterConfigDataFixture)(filterIdToMatchingDocumentIdsFixture);
    itemToFilteringStatusFixture.forEach( (filteredDocumenttatus, item) => {
            filteringStatisticsDataBuilder.addFilteredObjectStatus(filteredDocumenttatus, item.id)
        }
    );
    const filteringStatisticsData = filteringStatisticsDataBuilder.done();

    describe('serialize', () => {
        test('it should serialize the "FilteringData" data type', () => {
        expect(serialize(filterConfigDataFixture)(filteringStatisticsData)).toMatchSnapshot();
      });
    });
    
    describe('deserialize', () => {
        const deserializeFilteringData = deserialize(serialize(filterConfigDataFixture)(filteringStatisticsData));
    
        test('Should give all the document id validated', () => {
            expect(deserializeFilteringData.getDocumentsIdsValidated()).toEqual(filteringStatisticsData.getDocumentsIdsValidated());
        });
        
        test('Should give all the document id rejected by multiple filters', () => {
            expect(deserializeFilteringData.getDocumentsIdsRejectedByMultipleFilters()).toEqual(filteringStatisticsData.getDocumentsIdsRejectedByMultipleFilters());
        });
    
        test('Should give a dictionary of FilteringStat by filter non applied', () => {
            expect(deserializeFilteringData.getNextFilterStatesForNonAppliedFilterId()).toEqual(filteringStatisticsData.getNextFilterStatesForNonAppliedFilterId());
        });
        
        filterConfigDataFixture.getAllFilterGroupIds().forEach(filterGroupId => {
            test(`Should give all the document id rejected by group "${filterGroupId}"`, () => {
                expect(deserializeFilteringData.getDocumentsIdsRejectedByGroupId(filterGroupId)).toEqual(filteringStatisticsData.getDocumentsIdsRejectedByGroupId(filterGroupId));
            });
        });
    
        filterConfigDataFixture.getFilterIdsNotApplied().forEach(filterId => {
            test(`Should give all the FilteringStat by filter "${filterId}"`, () => {
                expect(deserializeFilteringData.getNextFilterStateForFilterId(filterId)).toEqual(filteringStatisticsData.getNextFilterStateForFilterId(filterId));
            });
        });
    });    

})
