import { validateFilterConfig } from './filterSchema.validator';
import { buildFilterConfigData as buildFilterConfigDataFromFilterConfig, FiltersApplied, FilterConfigData } from './filterConfig.model';
import { EitherAsync } from 'purify-ts/EitherAsync';

export {
    buildFilterConfigData as buildFilterConfigDataFromFilterConfig,
    Filter,
    GroupId,
    FilterId,
    FilterConfig,
    FilterConfigData,
    FilterOperand,
    FiltersApplied,
    GroupDictionary,
} from './filterConfig.model' 

export {
    Operators,
    operatorToFunction,
} from './operators' 

export const buildFilterConfigData =
    <T>(filterConfigDraft: any) =>
    (filterIdsApplied: FiltersApplied): EitherAsync<Error, FilterConfigData<T>> => (
      validateFilterConfig<T>(filterConfigDraft)
        .map(filterConfig => (buildFilterConfigDataFromFilterConfig(filterConfig)(filterIdsApplied)))
  )
