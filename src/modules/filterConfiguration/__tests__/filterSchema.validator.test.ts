import { validateFilterConfig } from '../filterSchema.validator';
import { filterConfigFixture } from './__fixtures__/fixtures'
import { emptyFilterConfigFixture, emptyGroupOfFiltersFixture, invalidOperatorFixture } from './__fixtures__/wrongFilterConfig.fixture'

describe('validateFilterConfig', () => {
	test('it should return the filterConfig is the validation succeeds', () => (
		validateFilterConfig(filterConfigFixture)
		.run()
		.then(eitherFilterConfig => expect(eitherFilterConfig.isRight()).toBe(true))
	));

    test('it should reject the filterConfig if it is empty', () => (
		validateFilterConfig(emptyFilterConfigFixture)
		.run()
		.then(eitherFilterConfig => expect(eitherFilterConfig.isLeft()).toBe(true))
	));

    test('it should reject the filterConfig if a group of filter is empty', () => (
		validateFilterConfig(emptyGroupOfFiltersFixture)
		.run()
		.then(eitherFilterConfig => expect(eitherFilterConfig.isLeft()).toBe(true))
	));

    test('it should reject the filterConfig if an operator is invalid', () => (
		validateFilterConfig(invalidOperatorFixture)
		.run()
		.then(eitherFilterConfig => expect(eitherFilterConfig.isLeft()).toBe(true))
	));
});