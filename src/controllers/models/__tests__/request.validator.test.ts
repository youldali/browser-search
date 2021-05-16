import { validateRequest } from '../request.validator';
import { 
	getRequestFixture, 
	getShortRequestFixture,
} from './__fixtures__/request.fixture';

describe('validateRequest', () => {
	test('it should return the request when the validation succeeds', () => (
		validateRequest(getRequestFixture())
		.run()
		.then(eitherRequestFixture => {
			expect(eitherRequestFixture.isRight()).toBe(true);
			expect(eitherRequestFixture.extract()).toMatchSnapshot();
		})
	));

	test('it should return the request when the validation succeeds (optional fields are omitted)', () => (
		validateRequest(getShortRequestFixture())
		.run()
		.then(eitherRequestFixture => {
			expect(eitherRequestFixture.isRight()).toBe(true);
			expect(eitherRequestFixture.extract()).toMatchSnapshot();
		})
	));

  test('it should return an error when per page is invalid', () => (		
		validateRequest(getRequestFixture({perPage: 'invalid'} as any))
		.run()
		.then(eitherRequestFixture => {
			expect(eitherRequestFixture.isLeft()).toBe(true);
			expect(eitherRequestFixture.extract()).toMatchSnapshot();
		})
	));

	test('it should return an error when per page is invalid number', () => (		
		validateRequest(getRequestFixture({perPage: -1} as any))
		.run()
		.then(eitherRequestFixture => {
			expect(eitherRequestFixture.isLeft()).toBe(true);
			expect(eitherRequestFixture.extract()).toMatchSnapshot();
		})
	));

	test('it should return an error when per page is invalid', () => (		
		validateRequest(getRequestFixture({page: 'invalid'} as any))
		.run()
		.then(eitherRequestFixture => {
			expect(eitherRequestFixture.isLeft()).toBe(true);
			expect(eitherRequestFixture.extract()).toMatchSnapshot();
		})
	));

	test('it should return an error when per page is invalid number', () => (		
		validateRequest(getRequestFixture({page: -1} as any))
		.run()
		.then(eitherRequestFixture => {
			expect(eitherRequestFixture.isLeft()).toBe(true);
			expect(eitherRequestFixture.extract()).toMatchSnapshot();
		})
	));

	test('it should return an error when order by is invalid', () => (		
		validateRequest(getRequestFixture({orderBy: 1} as any))
		.run()
		.then(eitherRequestFixture => {
			expect(eitherRequestFixture.isLeft()).toBe(true);
			expect(eitherRequestFixture.extract()).toMatchSnapshot();
		})
	));

	test('it should return an error when order direction is invalid', () => (		
		validateRequest(getRequestFixture({orderDirection: 'AAA'} as any))
		.run()
		.then(eitherRequestFixture => {
			expect(eitherRequestFixture.isLeft()).toBe(true);
			expect(eitherRequestFixture.extract()).toMatchSnapshot();
		})
	));

	test('it should return an error when storeId is invalid', () => (		
		validateRequest(getRequestFixture({storeId: 33} as any))
		.run()
		.then(eitherRequestFixture => {
			expect(eitherRequestFixture.isLeft()).toBe(true);
			expect(eitherRequestFixture.extract()).toMatchSnapshot();
		})
	));

	test('it should return an error when filterApplied is invalid', () => (		
		validateRequest(getRequestFixture({filtersApplied: [33]} as any))
		.run()
		.then(eitherRequestFixture => {
			expect(eitherRequestFixture.isLeft()).toBe(true);
			expect(eitherRequestFixture.extract()).toMatchSnapshot();
		})
	));

	test('it should return an error when filterConfig is invalid', () => (		
		validateRequest(getRequestFixture({filterConfig: []} as any))
		.run()
		.then(eitherRequestFixture => {
			expect(eitherRequestFixture.isLeft()).toBe(true);
			expect(eitherRequestFixture.extract()).toMatchSnapshot();
		})
	));

});