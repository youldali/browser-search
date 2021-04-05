import { validateFilterConfig } from './filterSchema.validator';
import * as F from './filterConfig.model';
import { EitherAsync } from 'purify-ts/EitherAsync';

export {
    Filter,
    FilterGroupId,
    FilterId,
    FilterConfig,
    FilterConfigData,
    FilterOperand,
    FiltersApplied,
    FiltersByGroup,
} from './filterConfig.model' 

export {
    Operators,
    operatorToFunction,
} from './operators' 

export const buildFilterConfigData =
    (filterConfig: any) =>
    (filterIdsApplied: F.FiltersApplied): EitherAsync<string[], F.FilterConfigData> => {
        const eitherFilterConfig = validateFilterConfig(filterConfig);
        
        const eitherFilterConfigData = eitherFilterConfig.map(filterConfig => {
            const filterConfigData = F.buildFilterConfigData(filterConfig)(filterIdsApplied);
            return filterConfigData;
        });

        return eitherFilterConfigData;
}
