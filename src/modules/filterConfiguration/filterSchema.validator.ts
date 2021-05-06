import * as yup from 'yup';
import { operators } from './operators'
import { FilterConfig } from './filterConfig.model'
import { fromPromise, EitherAsync } from 'purify-ts/EitherAsync'
import { Left, Right } from 'purify-ts/Either'
import { uniq } from 'ramda';

const alphanumRegex = /^[A-Za-z0-9]+$/;
/**
 * Validates the JSON filter config passed to the library
 * If invalid, returns a Left(error)
 */

const emptyFilterConfigErrorMessage = 'Filter Config Error: The filter configuration cannot be empty';
const emptyGroupErrorMessage = 'Filter Config Error: A group of filters cannot be empty';

const invalidOperatorErrorMessage = 'Filter Config Error: An operator is invalid. Valid operators are: ' + operators.toString();
const invalidFieldNameErrorMessage = 'Filter Config Error: All field names must be alpha-numeric. They should match a key of the object stored';
const invalidIdErrorMessage = 'Filter Config Error: All Ids must be alpha-numeric. They should uniquely identify a filter';

const fieldNameRequiredErrorMessage = 'Filter Config Error: A field name is missing';
const idNameRequiredErrorMessage = 'Filter Config Error: A filter Id is missing';
const operatorRequiredErrorMessage = 'Filter Config Error: An operator is missing';

const uniqueIdsErrorMessage = 'Filter Config Error: Ids of filters must be unique';

const filterSchema = yup.object({
	id: yup.string().typeError(invalidIdErrorMessage).required(idNameRequiredErrorMessage),
	field: yup.string().typeError(invalidFieldNameErrorMessage).matches(alphanumRegex, invalidFieldNameErrorMessage).required(fieldNameRequiredErrorMessage),
	operator: yup.string().oneOf(Object.values(operators), invalidOperatorErrorMessage).required(operatorRequiredErrorMessage),
	operand: yup.mixed(),
}).required();
const groupOfFiltersSchema = yup.array().of(filterSchema).min(1, emptyGroupErrorMessage).required();
const filterConfigSchema = yup.array().of(groupOfFiltersSchema).min(1, emptyFilterConfigErrorMessage)

export const validateFilterConfig = <T>(filterConfig: any): EitherAsync<Error, FilterConfig<T>> => {
	const validation = filterConfigSchema.validate(filterConfig, {
		strict: true,
		stripUnknown: true,
	})
	.then( (filterConfig) => (
		testFilterConfigUniqueIds(filterConfig as FilterConfig<T>) 
		? Right(filterConfig as FilterConfig<T>)
		: Left(new Error(uniqueIdsErrorMessage))
	))
	.catch(err => Left(new Error(err.errors)))


	return fromPromise(() => validation);
}

const testFilterConfigUniqueIds = (filterConfig: FilterConfig<any>): boolean => {
	const filterIds = filterConfig.reduce((filterIdsAcc: string[], groupOfFilters) => (
		groupOfFilters.reduce((filterIdsAcc, filter) => {
			filterIdsAcc.push(filter.id);
			return filterIdsAcc;
		}, filterIdsAcc)
	), []);

	const uniqFilterIds = uniq(filterIds);
	return filterIds.length === uniqFilterIds.length;
} 