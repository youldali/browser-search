import * as yup from 'yup';
import { Operators } from './operators'
import { FilterConfig } from './filterConfig.model'
import { fromPromise, EitherAsync } from 'purify-ts/EitherAsync'
import { Left, Right } from 'purify-ts/Either'

const alphanumRegex = /^[A-Za-z0-9]+$/;
/**
 * Validates the JSON filter config passed to the library
 * If invalid, returns a Left(error)
 */

const filterSchemaErrorMessage = 'Group of filters cannot be empty';
const filterConfigSchemaErrorMessage = 'Filter configuration cannot be empty';
const filterConfigInvalidOperatorErrorMessage = 'The operator is invalid';
const fieldNameErrorMessage = 'Field name must be alpha-numeric';
const fieldNameRequiredErrorMessage = 'Field name is required';
const idNameRequiredErrorMessage = 'Id is required';


const filterSchema = yup.object({
	id: yup.string().required(idNameRequiredErrorMessage),
	field: yup.string().matches(alphanumRegex, fieldNameErrorMessage).required(fieldNameRequiredErrorMessage),
	operator: yup.string().oneOf(Object.values(Operators), filterConfigInvalidOperatorErrorMessage).required(),
	operand: yup.mixed().required(),
}).required();
const groupOfFiltersSchema = yup.array().of(filterSchema).min(1, filterSchemaErrorMessage).required();
const filterConfigSchema = yup.array().of(groupOfFiltersSchema).min(1, filterConfigSchemaErrorMessage).required();

export const validateFilterConfig = <T>(filterConfig: any): EitherAsync<Error, FilterConfig<T>> => {
	const validation = filterConfigSchema.validate(filterConfig, {
		strict: true,
		stripUnknown: true,
	})
	.then( (value) => Right(value as FilterConfig<T>))
	.catch(err => Left(new Error(err.errors)))


	return fromPromise(() => validation);
}
