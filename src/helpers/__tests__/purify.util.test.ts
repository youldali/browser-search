import { allEitherAsyncs } from '../purify.util';
import { liftPromise } from 'purify-ts/EitherAsync'

describe('allEitherAsyncs', () => {
	test('returns all the resolved values if there is no Left', () => {
        const promises = [Promise.resolve(1), Promise.resolve(1), Promise.resolve(1)]
        const eithersAsyncs = promises.map(promise => liftPromise( () => promise));

        allEitherAsyncs(eithersAsyncs)
            .run()
            .then(result => {
                expect(result.isRight()).toBeTruthy();
                expect(result).toEqual([1,2,3]);
            })
	});

    test('returns Left if a promise returns an error', () => {
        const promises = [Promise.resolve(1), Promise.reject('Error'), Promise.resolve(1)]
        const eithersAsyncs = promises.map(promise => liftPromise( () => promise));

        allEitherAsyncs(eithersAsyncs)
            .run()
            .then(result => {
                expect(result.isLeft()).toBeTruthy();
                expect(result).toEqual('Error');
            })
	});
});