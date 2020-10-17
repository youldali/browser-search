import { EitherAsync, liftPromise } from 'purify-ts/EitherAsync'
import { Either, Left, Right } from 'purify-ts/Either'

export const allEitherAsyncs = <E,T>(eitherAyncs: EitherAsync<E,T>[]): EitherAsync<E,T[]> => {
    const runEitherAyncs = eitherAyncs.map(eitherAsync => eitherAsync.run());
    return (
        liftPromise(() => new Promise((resolve, reject) => {
            Promise.all(runEitherAyncs)
                .then(results => {
                    const t = traverseEithers(results);
                    t.ifLeft(left => reject(left));
                    t.ifRight(right => resolve(right) )
                })
        }))
    )
}

const traverseEithers = <E,T>(eithers: Either<E,T>[]): Either<E, T[]> => {
    const i: Either<E, T[]> = Right([])
    const traversedEithers = 
        eithers.reduce((acc: Either<E, T[]>, either: Either<E, T>): Either<E, T[]> => {
            if(acc.isRight() && either.isRight()){
                const value = either.extract()
                acc.map(results => [...results, value]);
                return acc as Either<E, T[]>;
            }
            
            return acc.isLeft() ? acc : Left(either.extract() as E);
        }, i);

    return traversedEithers;
}