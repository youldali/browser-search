import { validateFilterConfig } from '../filterSchema.validator';
import * as fixtures from '../__fixtures__/filterConfig.fixture'
import * as wrongFixtures from '../__fixtures__/wrongFilterConfig.fixture'

describe('validateFilterConfig', () => {
	test('it should return the filterConfig is the validation succeeds', () => {
		expect(validateFilterConfig(fixtures.filterConfig).isRight()).toBe(true);
	});

    test('it should reject the filterConfig if it is empty', () => {
		expect(validateFilterConfig(wrongFixtures.emptyFilterConfig).isLeft()).toBe(true)
	});

    test('it should reject the filterConfig if a group of filter is empty', () => {
		expect(validateFilterConfig(wrongFixtures.emptyGroupOfFilters).isLeft()).toBe(true)
	});

    test('it should reject the filterConfig if an operator is invalid', () => {
		expect(validateFilterConfig(wrongFixtures.invalidOperator).isLeft()).toBe(true);
	});
});