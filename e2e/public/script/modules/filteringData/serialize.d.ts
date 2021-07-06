import { DocumentId, FilteringData, NextFilterState } from './filteringData.model';
import { FilterConfigData } from 'modules/filterConfiguration';
export interface SerializedFilteringData {
    documentsIdsValidated: DocumentId[];
    documentsIdsRejectedByMultipleFilters: DocumentId[];
    nextFilterStatesForNonAppliedFilterId: Dictionary<NextFilterState>;
    documentsIdsRejectedByGroupId: Dictionary<DocumentId[]>;
    nextFilterStateForFilterId: Dictionary<NextFilterState>;
    nextFilterStates: Dictionary<NextFilterState>;
}
export declare const serialize: <T>(filterConfigData: FilterConfigData<T>) => (filteringData: FilteringData) => SerializedFilteringData;
export declare const deserialize: (serializedFilteringData: SerializedFilteringData) => FilteringData;
