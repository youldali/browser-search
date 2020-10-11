import logger from 'loglevel';
import { Either } from 'purify-ts/Either';

export const logEither = (either: Either<Error, any>) => (
    either.ifLeft( error => logger.error(error))
);

export const logEithers = (...eithers: Either<Error, any>[]) => (
    eithers.map(logEither)
);
