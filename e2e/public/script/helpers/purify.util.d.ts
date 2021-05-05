import { EitherAsync } from 'purify-ts/EitherAsync';
import { Either } from 'purify-ts/Either';
export declare const allEitherAsyncs: <E, T>(eitherAyncs: EitherAsync<E, T>[]) => EitherAsync<E, T[]>;
export declare const traverseEithers: <E, T>(eithers: Either<E, T>[]) => Either<E, T[]>;
