import { DocumentId, FilteringData, NextFilterState } from './filteringData.model'
import { GroupId, FilterId, FilterConfigData } from 'modules/filterConfiguration'

export interface SerializedFilteringData {
  documentsIdsValidated: DocumentId[];
  documentsIdsRejectedByMultipleFilters: DocumentId[];
  nextFilterStatesForNonAppliedFilterId: Dictionary<NextFilterState>;
  documentsIdsRejectedByGroupId: Dictionary<DocumentId[]>;
  nextFilterStateForFilterId: Dictionary<NextFilterState>;
}

export const serialize = <T>(filterConfigData: FilterConfigData<T>) => (filteringData: FilteringData): SerializedFilteringData => {
  const documentsIdsValidated = filteringData.getDocumentsIdsValidated();
  const documentsIdsRejectedByMultipleFilters = filteringData.getDocumentsIdsRejectedByMultipleFilters();
  const nextFilterStatesForNonAppliedFilterId = filteringData.getNextFilterStatesForNonAppliedFilterId();

  const groupIds = filterConfigData.getAllFilterGroupIds();
  const documentsIdsRejectedByGroupId = groupIds.reduce((acc: Dictionary<DocumentId[]>, groupId: GroupId): Dictionary<DocumentId[]> => {
    acc[groupId] = filteringData.getDocumentsIdsRejectedByGroupId(groupId);
    return acc;
  }, {})

  const filterIds = filterConfigData.getAllFilterIds();
  const nextFilterStateForFilterId = filterIds.reduce((acc: Dictionary<NextFilterState>, filterId: FilterId): Dictionary<NextFilterState> => {
    acc[filterId] = filteringData.getNextFilterStateForFilterId(filterId);
    return acc;
  }, {})

  return {
    documentsIdsValidated,
    documentsIdsRejectedByMultipleFilters,
    nextFilterStatesForNonAppliedFilterId,
    documentsIdsRejectedByGroupId, 
    nextFilterStateForFilterId
  }
}

export const deserialize = (serializedFilteringData: SerializedFilteringData): FilteringData => {
  const getDocumentsIdsValidated = () => serializedFilteringData.documentsIdsValidated;
  const getDocumentsIdsRejectedByMultipleFilters = () => serializedFilteringData.documentsIdsRejectedByMultipleFilters;
  const getNextFilterStatesForNonAppliedFilterId = () => serializedFilteringData.nextFilterStatesForNonAppliedFilterId;
  const getNextFilterStateForFilterId = (filterId: FilterId) => (serializedFilteringData.nextFilterStateForFilterId[filterId]);
  const getDocumentsIdsRejectedByGroupId = (groupId: GroupId) => (serializedFilteringData.documentsIdsRejectedByGroupId[groupId]);

  return {
    getNextFilterStatesForNonAppliedFilterId,
    getNextFilterStateForFilterId,
    getDocumentsIdsRejectedByGroupId,
    getDocumentsIdsRejectedByMultipleFilters,
    getDocumentsIdsValidated,
  }

}