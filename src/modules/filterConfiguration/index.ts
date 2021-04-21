import { validateFilterConfig } from './filterSchema.validator';
import * as F from './filterConfig.model';
import { EitherAsync } from 'purify-ts/EitherAsync';

export {
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
    <T>(filterConfig: any) =>
    (filterIdsApplied: F.FiltersApplied): EitherAsync<Error, F.FilterConfigData<T>> => (
      validateFilterConfig<T>(filterConfig)
        .map(filterConfig => (F.buildFilterConfigData(filterConfig)(filterIdsApplied)))
  )
