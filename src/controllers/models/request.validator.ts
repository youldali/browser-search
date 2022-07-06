import * as yup from 'yup';
import { EitherAsync } from 'purify-ts/EitherAsync'
import { Left, Right } from 'purify-ts/Either'
import { requestErrors } from './requestErrors';
import { Request, StoreId } from './request.model';
import { validateFilterConfig } from '../../modules/filterConfiguration'

const requestSchema = yup.object({
	storeId: yup.string().typeError(requestErrors['Request/InvalidStoreId']).required(requestErrors['Request/InvalidStoreId']),
	filtersApplied: yup.array().of(yup.string()).typeError(requestErrors['Request/InvalidFiltersApplied']),
	page: yup.number().typeError(requestErrors['Request/InvalidPage']).min(0, requestErrors['Request/InvalidPage']).round('round').optional(),
  perPage: yup.number().typeError(requestErrors['Request/InvalidPerPage']).positive(requestErrors['Request/InvalidPerPage']).round('round').optional(),
  orderDirection: yup.string().typeError(requestErrors['Request/InvalidOrderDirection']).oneOf(['ASC', 'DESC'], requestErrors['Request/InvalidOrderDirection']).optional(),
	orderBy: yup.string().typeError(requestErrors['Request/InvalidOrderBy']).optional(),
}).required();

export interface ExtraValidators {
	getStoreExist: (storeId: StoreId) => EitherAsync<Error, boolean>;
}

export const validateRequest = <T>(extraValidators: ExtraValidators) => (request: any) : EitherAsync<Error, Request<T>> =>  (
	validateBaseRequest(request)
	.chain(baseRequest => (
		validateFilterConfig(request.filterConfig)
		.map(filterConfig => ({...baseRequest, filterConfig}))
	))
	.chain(request => validateStoreExistence(extraValidators.getStoreExist)(request))
)

type BaseRequest<T, TFilterId extends string = string> = Omit<Request<T, TFilterId>, 'filterConfig'>
const validateBaseRequest = <T>(request: any): EitherAsync<Error, BaseRequest<T>> => {
  const validation = requestSchema.validate(request, {
		strict: true,
		stripUnknown: true,
	})
	.then( (request) => Right(request as Request<T>))
	.catch(err => Left(new Error(err.errors)))

	return EitherAsync.fromPromise(() => validation);
}

const validateStoreExistence = <T, TFilterId extends string = string>(getStoreExist: ExtraValidators['getStoreExist']) => (request: Request<T, TFilterId>): EitherAsync<Error, Request<T, TFilterId>> => (
	getStoreExist(request.storeId)
	.map(doesStoreExist => {
		if(doesStoreExist) {
			return request;
		}
		throw new Error(requestErrors['Request/StoreDoesNotExist'])
	})
)