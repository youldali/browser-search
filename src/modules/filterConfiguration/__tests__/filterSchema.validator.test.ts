import { validateFilterConfig } from '../filterSchema.validator';
import * as fixtures from '../__fixtures__/filterConfig'

describe('validateFilterConfig', () => {
	test('it should return the filterConfig is the validation succeeds', () => {
		expect(validateFilterConfig(fixtures.validFilterConfig).isRight()).toBe(true);
	});

    test('it should reject the filterConfig if it is empty', () => {
		expect(validateFilterConfig(fixtures.emptyFilterConfig).isLeft()).toBe(true)
	});

    test('it should reject the filterConfig if a group of filter is empty', () => {
		expect(validateFilterConfig(fixtures.emptyGroupOfFilters).isLeft()).toBe(true)
	});

    test('it should reject the filterConfig if an operator is invalid', () => {
		expect(validateFilterConfig(fixtures.invalidOperator).isLeft()).toBe(true);
	});
});