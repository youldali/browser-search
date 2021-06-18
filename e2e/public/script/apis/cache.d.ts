export { FiltersApplied, FilterConfig, } from '../modules/filterConfiguration';
import { EitherAsync } from 'purify-ts/EitherAsync';
export declare const set: (keyToHash: object, value: any) => EitherAsync<Error, void>;
export declare const get: <T>(keyToHash: object) => EitherAsync<Error, T>;
