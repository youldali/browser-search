import { validateFilterConfig } from './filterSchema.validator';
import * as F from './filterConfig.model';
import { Either, Right } from 'purify-ts/Either'

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
    (filterIdsApplied: F.FiltersApplied): Either<Error, F.FilterConfigData> => {
        const eitherFilterConfig = validateFilterConfig(filterConfig);
        
        const eitherFilterConfigData = eitherFilterConfig.chain(filterConfig => {
            const filterConfigData = F.buildFilterConfigData(filterConfig)(filterIdsApplied);
            return Right(filterConfigData);
        });

        return eitherFilterConfigData;
}
