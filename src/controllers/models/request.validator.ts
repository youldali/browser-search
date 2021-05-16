import * as yup from 'yup';
import { fromPromise, EitherAsync } from 'purify-ts/EitherAsync'
import { Left, Right } from 'purify-ts/Either'
import { requestErrors } from './requestErrors';
import { Request } from './request.model';
import { validateFilterConfig } from '../../modules/filterConfiguration'

const requestSchema = yup.object({
	storeId: yup.string().typeError(requestErrors['Request/InvalidStoreId']).required(requestErrors['Request/InvalidStoreId']),
	filtersApplied: yup.array().of(yup.string()).typeError(requestErrors['Request/InvalidFiltersApplied']),
	page: yup.number().typeError(requestErrors['Request/InvalidPage']).positive(requestErrors['Request/InvalidPage']).round('round').optional(),
  perPage: yup.number().typeError(requestErrors['Request/InvalidPerPage']).positive(requestErrors['Request/InvalidPerPage']).round('round').optional(),
  orderDirection: yup.string().typeError(requestErrors['Request/InvalidOrderDirection']).oneOf(['ASC', 'DESC'], requestErrors['Request/InvalidOrderDirection']).optional(),
	orderBy: yup.string().typeError(requestErrors['Request/InvalidOrderBy']).optional(),
}).required();

export const validateRequest = <T>(request: any): EitherAsync<Error, Request<T>> => (
	validateBaseRequest(request)
	.chain(baseRequest => (
		validateFilterConfig(request.filterConfig)
		.map(filterConfig => ({...baseRequest, filterConfig}))
	))
)

type BaseRequest<T> = Omit<Request<T>, 'filterConfig'>
const validateBaseRequest = <T>(request: any): EitherAsync<Error, BaseRequest<T>> => {
  const validation = requestSchema.validate(request, {
		strict: true,
		stripUnknown: true,
	})
	.then( (request) => Right(request as Request<T>))
	.catch(err => Left(new Error(err.errors)))

	return fromPromise(() => validation);
}
