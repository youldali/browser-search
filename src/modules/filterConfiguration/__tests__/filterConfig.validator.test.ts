import { validateFilterConfig } from '../filterConfig.validator';
import { getFilterConfigFixture } from './__fixtures__/fixtures';


describe('validateFilterConfig', () => {
	test('it should return the filterConfig if the validation succeeds', () => (
		validateFilterConfig(getFilterConfigFixture())
		.run()
		.then(eitherFilterConfig => {
			expect(eitherFilterConfig.isRight()).toBe(true);
			expect(eitherFilterConfig.extract()).toMatchSnapshot();
		})
	));

  test('it should reject the filterConfig if it is empty', () => (
		validateFilterConfig([])
		.run()
		.then(eitherFilterConfig => {
			expect(eitherFilterConfig.isLeft()).toBe(true);
			expect((eitherFilterConfig.extract() as Error).message).toMatchSnapshot();
		})
	));

  test('it should reject the filterConfig if a group of filter is empty', () => (
		validateFilterConfig(getFilterConfigFixture([[]]))
		.run()
		.then(eitherFilterConfig => {
			expect(eitherFilterConfig.isLeft()).toBe(true);
			expect((eitherFilterConfig.extract() as Error).message).toMatchSnapshot();
		})
	));

  test('it should reject the filterConfig if an operator is invalid', () => (
		validateFilterConfig(getFilterConfigFixture([[{ id: 'priceMin', field: 'price', operator: '.....', operand: 200 } as any]]))
		.run()
		.then(eitherFilterConfig => {
			expect(eitherFilterConfig.isLeft()).toBe(true);
			expect((eitherFilterConfig.extract() as Error).message).toMatchSnapshot();
		})
	));

	test('it should reject the filterConfig if a field is invalid', () => (
		validateFilterConfig(getFilterConfigFixture([[{ id: 'priceMin', field: 2, operator: 'gt', operand: 200 } as any]]))
		.run()
		.then(eitherFilterConfig => {
			expect(eitherFilterConfig.isLeft()).toBe(true);
			expect((eitherFilterConfig.extract() as Error).message).toMatchSnapshot();
		})
	));

	test('it should reject the filterConfig if an Id is invalid', () => (
		validateFilterConfig(getFilterConfigFixture([[{ id: 33, field: 'price', operator: 'gt', operand: 200 } as any]]))
		.run()
		.then(eitherFilterConfig => {
			expect(eitherFilterConfig.isLeft()).toBe(true);
			expect((eitherFilterConfig.extract() as Error).message).toMatchSnapshot();
		})
	));

	test('it should reject the filterConfig if the field Id is missing', () => (
		validateFilterConfig(getFilterConfigFixture([[{ field: 'price', operator: 'gt', operand: 200 } as any]]))
		.run()
		.then(eitherFilterConfig => {
			expect(eitherFilterConfig.isLeft()).toBe(true);
			expect((eitherFilterConfig.extract() as Error).message).toMatchSnapshot();
		})
	));

	test('it should reject the filterConfig if the field name is missing', () => (
		validateFilterConfig(getFilterConfigFixture([[{ id: 'priceMin', operator: 'gt', operand: 200 } as any]]))
		.run()
		.then(eitherFilterConfig => {
			expect(eitherFilterConfig.isLeft()).toBe(true);
			expect((eitherFilterConfig.extract() as Error).message).toMatchSnapshot();
		})
	));

	test('it should reject the filterConfig if the operator is missing', () => (
		validateFilterConfig(getFilterConfigFixture([[{ id: 'priceMin', field: 'price', operand: 200 } as any]]))
		.run()
		.then(eitherFilterConfig => {
			expect(eitherFilterConfig.isLeft()).toBe(true);
			expect((eitherFilterConfig.extract() as Error).message).toMatchSnapshot();
		})
	));

	test('it should reject the filterConfig if the Ids are not uniq', () => (
		validateFilterConfig(getFilterConfigFixture(
			[
				[ 
						{ id: 'priceMin', field: 'price', operator: 'gt', operand: 200 }, 
				],
				[ 
						{ id: 'priceMin', field: 'price', operator: 'lt', operand: 100 }, 
				],
			]
		))
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
		validateFilterConfig(getFilterConfigFixture([{} as any]))
		.run()
		.then(eitherFilterConfig => {
			expect(eitherFilterConfig.isLeft()).toBe(true);
			expect((eitherFilterConfig.extract() as Error).message).toMatchSnapshot();
		})
	));
});