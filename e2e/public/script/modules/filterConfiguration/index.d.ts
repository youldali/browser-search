import { FiltersApplied, FilterConfigData } from './filterConfig.model';
import { EitherAsync } from 'purify-ts/EitherAsync';
export { buildFilterConfigData as buildFilterConfigDataFromFilterConfig, Filter, GroupId, FilterId, FilterConfig, FilterConfigData, FilterOperand, FiltersApplied, GroupDictionary, } from './filterConfig.model';
export { Operator, operators, operatorToFunction, } from './operators';
export declare const buildFilterConfigData: <T>(filterConfigDraft: any) => (filterIdsApplied: FiltersApplied) => EitherAsync<Error, FilterConfigData<T>>;
