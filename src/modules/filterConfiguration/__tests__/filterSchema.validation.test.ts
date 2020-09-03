import { validateFilterConfig } from '../filterSchema.validator';
import { Right, Left } from 'purify-ts/Either'
import * as fixtures from '../__fixtures__/filterConfig'

describe('validateFilterConfig', () => {
	test('it should return the filterConfig is the validation succeeds', () => {
		expect(validateFilterConfig(fixtures.validFilterConfig)).toEqual(Right(fixtures.validFilterConfig));
	});

    test('it should reject the filterConfig is the operator is invalid', () => {
		expect(validateFilterConfig(fixtures.invalidFilterConfig1)).toBeInstanceOf(Left);
	});
});