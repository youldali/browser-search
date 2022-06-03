import { Either } from 'purify-ts/Either';
export declare const logEither: (either: Either<Error, any>) => Either<Error, any>;
export declare const logEithers: (...eithers: Either<Error, any>[]) => Either<Error, any>[];
