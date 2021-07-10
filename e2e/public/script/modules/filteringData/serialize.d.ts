import { DocumentId, FilteringData, NextFilterState } from './filteringData.model';
import { FilterConfigData } from 'modules/filterConfiguration';
export interface SerializedFilteringData {
    documentsIdsValidated: DocumentId[];
    documentsIdsRejectedByMultipleFilters: DocumentId[];
    documentsIdsRejectedByGroupId: Record<string, DocumentId[]>;
    nextFilterStateForFilterId: Record<string, NextFilterState>;
    nextFilterStates: Record<string, NextFilterState>;
}
export declare const serialize: <T>(filterConfigData: FilterConfigData<T, string>) => (filteringData: FilteringData) => SerializedFilteringData;
export declare const deserialize: (serializedFilteringData: SerializedFilteringData) => FilteringData;
