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

export const traverseEithers = <E,T>(eithers: Either<E,T>[]): Either<E, T[]> => (
    eithers.reduce(
        (eitherAcc: Either<E, T[]>, either: Either<E, T>): Either<E, T[]> => {
            if(eitherAcc.isRight() && either.isRight()){
                const value = either.extract()
                return eitherAcc.map(results => [...results, value]);
            }
            
            return eitherAcc.isLeft() ? eitherAcc : Left(either.extract() as E);
        }, 
        Right([])
    )
)