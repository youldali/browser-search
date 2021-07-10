import { EitherAsync } from 'purify-ts/EitherAsync';
export declare const set: <T>(keyToHash: object, value: T) => EitherAsync<Error, void>;
export declare const get: <T>(keyToHash: object) => EitherAsync<Error, T>;
export declare const deleteCache: () => EitherAsync<Error, void>;
