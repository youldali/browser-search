import { FilterConfig } from './filterConfig.model';
import { EitherAsync } from 'purify-ts/EitherAsync';
export declare const validateFilterConfig: <T>(filterConfig: any) => EitherAsync<Error, FilterConfig<T>>;
