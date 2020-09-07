import { validateFilterConfig } from './filterSchema.validator';
import * as F from './filterConfig.model';
import { Either, Right } from 'purify-ts/Either'

export {
    Filter,
    FilterGroup,
    FilterId,
    FilterConfig,
    FilterConfigData,
    FilterOperand,
    FiltersApplied,
    FiltersByGroup,
} from './filterConfig.model' 

export const buildFilterConfigData =
    (filterConfig: any) =>
    (filterIdsApplied: F.FiltersApplied): Either<string, F.FilterConfigData> => {
        const eitherFilterConfig = validateFilterConfig(filterConfig);
        
        const eitherFilterConfigData = eitherFilterConfig.chain(filterConfig => {
            const filterConfigData = F.buildFilterConfigData(filterConfig)(filterIdsApplied);
            return Right(filterConfigData);
        });

        return eitherFilterConfigData;
}
