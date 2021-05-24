import { Right } from 'purify-ts/Either';
import { EitherAsync } from 'purify-ts/EitherAsync'
import { validateRequest, ExtraValidators } from '../request.validator';
import { StoreId } from '../request.model';
import { 
	getRequestFixture, 
	getShortRequestFixture,
} from './__fixtures__/request.fixture';

describe('validateRequest', () => {
	const extraValidators: ExtraValidators = {
		getStoreExist: (storeId: StoreId) => EitherAsync.liftEither(storeId === 'dont-exist' ? Right(false) : Right(true))
	}
	const validateRequest_ = validateRequest(extraValidators);

	test('it should return the request when the validation succeeds', () => (
		validateRequest_(getRequestFixture())
		.run()
		.then(eitherRequestFixture => {
			expect(eitherRequestFixture.isRight()).toBe(true);
			expect(eitherRequestFixture.extract()).toMatchSnapshot();
		})
	));

	test('it should return the request when the validation succeeds (optional fields are omitted)', () => (
		validateRequest_(getShortRequestFixture())
		.run()
		.then(eitherRequestFixture => {
			expect(eitherRequestFixture.isRight()).toBe(true);
			expect(eitherRequestFixture.extract()).toMatchSnapshot();
		})
	));

  test('it should return an error when per page is invalid', () => (		
		validateRequest_(getRequestFixture({perPage: 'invalid'} as any))
		.run()
		.then(eitherRequestFixture => {
			expect(eitherRequestFixture.isLeft()).toBe(true);
			expect(eitherRequestFixture.extract()).toMatchSnapshot();
		})
	));

	test('it should return an error when per page is invalid number', () => (		
		validateRequest_(getRequestFixture({perPage: -1} as any))
		.run()
		.then(eitherRequestFixture => {
			expect(eitherRequestFixture.isLeft()).toBe(true);
			expect(eitherRequestFixture.extract()).toMatchSnapshot();
		})
	));

	test('it should return an error when per page is invalid', () => (		
		validateRequest_(getRequestFixture({page: 'invalid'} as any))
		.run()
		.then(eitherRequestFixture => {
			expect(eitherRequestFixture.isLeft()).toBe(true);
			expect(eitherRequestFixture.extract()).toMatchSnapshot();
		})
	));

	test('it should return an error when per page is invalid number', () => (		
		validateRequest_(getRequestFixture({page: -1} as any))
		.run()
		.then(eitherRequestFixture => {
			expect(eitherRequestFixture.isLeft()).toBe(true);
			expect(eitherRequestFixture.extract()).toMatchSnapshot();
		})
	));

	test('it should return an error when order by is invalid', () => (		
		validateRequest_(getRequestFixture({orderBy: 1} as any))
		.run()
		.then(eitherRequestFixture => {
			expect(eitherRequestFixture.isLeft()).toBe(true);
			expect(eitherRequestFixture.extract()).toMatchSnapshot();
		})
	));

	test('it should return an error when order direction is invalid', () => (		
		validateRequest_(getRequestFixture({orderDirection: 'AAA'} as any))
		.run()
		.then(eitherRequestFixture => {
			expect(eitherRequestFixture.isLeft()).toBe(true);
			expect(eitherRequestFixture.extract()).toMatchSnapshot();
		})
	));

	test('it should return an error when storeId is invalid', () => (		
		validateRequest_(getRequestFixture({storeId: 33} as any))
		.run()
		.then(eitherRequestFixture => {
			expect(eitherRequestFixture.isLeft()).toBe(true);
			expect(eitherRequestFixture.extract()).toMatchSnapshot();
		})
	));

	test('it should return an error when filterApplied is invalid', () => (		
		validateRequest_(getRequestFixture({filtersApplied: [33]} as any))
		.run()
		.then(eitherRequestFixture => {
			expect(eitherRequestFixture.isLeft()).toBe(true);
			expect(eitherRequestFixture.extract()).toMatchSnapshot();
		})
	));

	test('it should return an error when filterConfig is invalid', () => (		
		validateRequest_(getRequestFixture({filterConfig: []} as any))
		.run()
		.then(eitherRequestFixture => {
			expect(eitherRequestFixture.isLeft()).toBe(true);
			expect(eitherRequestFixture.extract()).toMatchSnapshot();
		})
	));

	test('it should return an error when the store does not exist', () => (		
		validateRequest_(getRequestFixture({storeId: 'dont-exist'}))
		.run()
		.then(eitherRequestFixture => {
			expect(eitherRequestFixture.isLeft()).toBe(true);
			expect(eitherRequestFixture.extract()).toMatchSnapshot();
		})
	));

});