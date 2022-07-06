import { DocumentId, FilteringData, NextFilterState } from './filteringData.model'
import { GroupId, FilterId, FilterConfigData } from 'modules/filterConfiguration'

export interface SerializedFilteringData {
  documentsIdsValidated: DocumentId[];
  documentsIdsRejectedByMultipleFilters: DocumentId[];
  documentsIdsRejectedByGroupId: Record<string, DocumentId[]>;
  nextFilterStateForFilterId: Record<string, NextFilterState>;
  nextFilterStates: Record<string, NextFilterState>;
}

export const serialize = <T>(filterConfigData: FilterConfigData<T>) => (filteringData: FilteringData): SerializedFilteringData => {
  const documentsIdsValidated = filteringData.getDocumentsIdsValidated();
  const documentsIdsRejectedByMultipleFilters = filteringData.getDocumentsIdsRejectedByMultipleFilters();
  const nextFilterStates = filteringData.getNextFilterStates();

  const groupIds = filterConfigData.getAllFilterGroupIds();
  const documentsIdsRejectedByGroupId = groupIds.reduce((acc: Record<string, DocumentId[]>, groupId: GroupId): Record<string, DocumentId[]> => {
    acc[groupId] = filteringData.getDocumentsIdsRejectedByGroupId(groupId);
    return acc;
  }, {})

  const filterIds = filterConfigData.getAllFilterIds();
  const nextFilterStateForFilterId = filterIds.reduce((acc: Record<string, NextFilterState>, filterId: FilterId): Record<string, NextFilterState> => {
    acc[filterId] = filteringData.getNextFilterStateForFilterId(filterId);
    return acc;
  }, {})

  return {
    documentsIdsValidated,
    documentsIdsRejectedByMultipleFilters,
    nextFilterStates,
    documentsIdsRejectedByGroupId, 
    nextFilterStateForFilterId
  }
}

export const deserialize = (serializedFilteringData: SerializedFilteringData): FilteringData => {
  const getDocumentsIdsValidated = () => serializedFilteringData.documentsIdsValidated;
  const getDocumentsIdsRejectedByMultipleFilters = () => serializedFilteringData.documentsIdsRejectedByMultipleFilters;
  const getNextFilterStates = () => serializedFilteringData.nextFilterStates;
  const getNextFilterStateForFilterId = (filterId: FilterId) => (serializedFilteringData.nextFilterStateForFilterId[filterId]);
  const getDocumentsIdsRejectedByGroupId = (groupId: GroupId) => (serializedFilteringData.documentsIdsRejectedByGroupId[groupId]);

  return {
    getNextFilterStates,
    getNextFilterStateForFilterId,
    getDocumentsIdsRejectedByGroupId,
    getDocumentsIdsRejectedByMultipleFilters,
    getDocumentsIdsValidated,
  }

}