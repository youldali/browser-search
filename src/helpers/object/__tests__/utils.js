import * as objectHelper from '../utils';

describe('hasOne', () => {
	const object = {a: 'prop1', b: 'prop2', c: 100};

	test('it return true if the Object has at least 1 of the mentionned property', () => {
		const propertiesToLookup = ['a', 'd', 'x', 'z'];
		const hasProperty = objectHelper.hasOne(propertiesToLookup)(object);
		expect(hasProperty).toBe(true)
	});

	test('it returns false if the Object has none of the mentionned property', () => {
		const propertiesToLookup = ['d', 'x', 'z'];
		const hasProperty = objectHelper.hasOne(propertiesToLookup)(object);
		expect(hasProperty).toBe(false)
	});
});