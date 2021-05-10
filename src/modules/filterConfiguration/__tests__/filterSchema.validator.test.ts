import { validateFilterConfig } from '../filterSchema.validator';
import { filterConfigFixture } from './__fixtures__/fixtures';
import { 
	missingIdFixture, 
	missingFieldFixture,
	missingOperatorFixture,
	emptyFilterConfigFixture, 
	emptyGroupOfFiltersFixture, 
	invalidOperatorFixture,
	invalidFieldFixture,
	invalidIdFixture,
	nonUniqueIdsFixture,
} from './__fixtures__/wrongFilterConfig.fixture';

describe('validateFilterConfig', () => {
	test('it should return the filterConfig if the validation succeeds', () => (
		validateFilterConfig(filterConfigFixture)
		.run()
		.then(eitherFilterConfig => {
			expect(eitherFilterConfig.isRight()).toBe(true);
			expect(eitherFilterConfig.extract()).toMatchSnapshot();
		})
	));

  test('it should reject the filterConfig if it is empty', () => (
		validateFilterConfig(emptyFilterConfigFixture)
		.run()
		.then(eitherFilterConfig => {
			expect(eitherFilterConfig.isLeft()).toBe(true);
			expect((eitherFilterConfig.extract() as Error).message).toMatchSnapshot();
		})
	));

  test('it should reject the filterConfig if a group of filter is empty', () => (
		validateFilterConfig(emptyGroupOfFiltersFixture)
		.run()
		.then(eitherFilterConfig => {
			expect(eitherFilterConfig.isLeft()).toBe(true);
			expect((eitherFilterConfig.extract() as Error).message).toMatchSnapshot();
		})
	));

  test('it should reject the filterConfig if an operator is invalid', () => (
		validateFilterConfig(invalidOperatorFixture)
		.run()
		.then(eitherFilterConfig => {
			expect(eitherFilterConfig.isLeft()).toBe(true);
			expect((eitherFilterConfig.extract() as Error).message).toMatchSnapshot();
		})
	));

	test('it should reject the filterConfig if a field is invalid', () => (
		validateFilterConfig(invalidFieldFixture)
		.run()
		.then(eitherFilterConfig => {
			expect(eitherFilterConfig.isLeft()).toBe(true);
			expect((eitherFilterConfig.extract() as Error).message).toMatchSnapshot();
		})
	));

	test('it should reject the filterConfig if an Id is invalid', () => (
		validateFilterConfig(invalidIdFixture)
		.run()
		.then(eitherFilterConfig => {
			expect(eitherFilterConfig.isLeft()).toBe(true);
			expect((eitherFilterConfig.extract() as Error).message).toMatchSnapshot();
		})
	));

	test('it should reject the filterConfig if the field Id is missing', () => (
		validateFilterConfig(missingIdFixture)
		.run()
		.then(eitherFilterConfig => {
			expect(eitherFilterConfig.isLeft()).toBe(true);
			expect((eitherFilterConfig.extract() as Error).message).toMatchSnapshot();
		})
	));

	test('it should reject the filterConfig if the field name is missing', () => (
		validateFilterConfig(missingFieldFixture)
		.run()
		.then(eitherFilterConfig => {
			expect(eitherFilterConfig.isLeft()).toBe(true);
			expect((eitherFilterConfig.extract() as Error).message).toMatchSnapshot();
		})
	));

	test('it should reject the filterConfig if the operator is missing', () => (
		validateFilterConfig(missingOperatorFixture)
		.run()
		.then(eitherFilterConfig => {
			expect(eitherFilterConfig.isLeft()).toBe(true);
			expect((eitherFilterConfig.extract() as Error).message).toMatchSnapshot();
		})
	));

	test('it should reject the filterConfig if the Ids are not uniq', () => (
		validateFilterConfig(nonUniqueIdsFixture)
		.run()
		.then(eitherFilterConfig => {
			expect(eitherFilterConfig.isLeft()).toBe(true);
			expect((eitherFilterConfig.extract() as Error).message).toMatchSnapshot();
		})
	));

	test('it should reject the filterConfig if undefined', () => (
		validateFilterConfig(undefined)
		.run()
		.then(eitherFilterConfig => {
			expect(eitherFilterConfig.isLeft()).toBe(true);
			expect((eitherFilterConfig.extract() as Error).message).toMatchSnapshot();
		})
	));

	test('it should reject the filterConfig if wrong type', () => (
		validateFilterConfig({})
		.run()
		.then(eitherFilterConfig => {
			expect(eitherFilterConfig.isLeft()).toBe(true);
			expect((eitherFilterConfig.extract() as Error).message).toMatchSnapshot();
		})
	));

	test('it should reject the filterConfig if wrong filter group type', () => (
		validateFilterConfig([{}])
		.run()
		.then(eitherFilterConfig => {
			expect(eitherFilterConfig.isLeft()).toBe(true);
			expect((eitherFilterConfig.extract() as Error).message).toMatchSnapshot();
		})
	));
});