import { allEitherAsyncs, traverseEithers } from '../purify.util';
import { liftPromise } from 'purify-ts/EitherAsync'
import { Left, Right } from 'purify-ts/Either'

describe('allEitherAsyncs', () => {
	test('returns all the resolved values if there is no Left', () => {
        const promises = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]
        const eithersAsyncs = promises.map(promise => liftPromise( () => promise));

        return (
            allEitherAsyncs(eithersAsyncs)
                .run()
                .then(result => {
                    expect(result.isRight()).toBeTruthy();
                    expect(result.extract()).toEqual([1,2,3]);
                })
        );
	});

    test('returns Left if a promise returns an error', () => {
        const promises = [Promise.resolve(1), Promise.reject('Error'), Promise.resolve(3)]
        const eithersAsyncs = promises.map(promise => liftPromise( () => promise));

        return (
            allEitherAsyncs(eithersAsyncs)
                .run()
                .then(result => {
                    expect(result.isLeft()).toBeTruthy();
                    expect(result.extract()).toEqual('Error');
                })
        );
	});
});

describe('traverseEithers', () => {
	test('when receiving Right<T>[], returns Right([T])', () => {
        const rights = [Right(1), Right(2), Right(3)];
        const traversedRights = traverseEithers(rights);

        expect(traversedRights.isRight()).toBeTruthy();
        expect(traversedRights.extract()).toEqual([1,2,3]);
	});

    test('when at least one element is Left, returns this Left', () => {
        const rightsAndLefts = [Right(1), Left('Error'), Right(3)];
        const traversedRightsAndLefts = traverseEithers(rightsAndLefts);

        expect(traversedRightsAndLefts.isLeft()).toBeTruthy();
        expect(traversedRightsAndLefts.extract()).toEqual('Error');

	});
});