import { validateFilterConfig } from '../filterSchema.validator';
import * as fixtures from './__fixtures__/fixtures'
import * as wrongFixtures from './__fixtures__/wrongFilterConfig.fixture'

describe('validateFilterConfig', () => {
	test('it should return the filterConfig is the validation succeeds', () => (
		validateFilterConfig(fixtures.filterConfig)
		.run()
		.then(eitherFilterConfig => expect(eitherFilterConfig.isRight()).toBe(true))
	));

    test('it should reject the filterConfig if it is empty', () => (
		validateFilterConfig(wrongFixtures.emptyFilterConfig)
		.run()
		.then(eitherFilterConfig => expect(eitherFilterConfig.isLeft()).toBe(true))
	));

    test('it should reject the filterConfig if a group of filter is empty', () => (
		validateFilterConfig(wrongFixtures.emptyGroupOfFilters)
		.run()
		.then(eitherFilterConfig => expect(eitherFilterConfig.isLeft()).toBe(true))
	));

    test('it should reject the filterConfig if an operator is invalid', () => (
		validateFilterConfig(wrongFixtures.invalidOperator)
		.run()
		.then(eitherFilterConfig => expect(eitherFilterConfig.isLeft()).toBe(true))
	));
});