import * as yup from 'yup';
import { operators } from './operators'
import { FilterConfig } from './filterConfig.model'
import { errors } from './error';
import { EitherAsync } from 'purify-ts/EitherAsync'
import { Left, Right } from 'purify-ts/Either'
import { uniq } from 'ramda';

const alphanumRegex = /^[A-Za-z0-9]+$/;
/**
 * Validates the JSON filter config passed to the library
 * If invalid, returns a Left(error)
 */

const filterSchema = yup.object({
	id: yup.string().typeError(errors['FilterConfig/InvalidId']).required(errors['FilterConfig/MissingId']),
	field: yup.string().typeError(errors['FilterConfig/InvalidFieldName']).matches(alphanumRegex, errors['FilterConfig/InvalidFieldName']).required(errors['FilterConfig/MissingFieldName']),
	operator: yup.string().oneOf(Object.values(operators), errors['FilterConfig/InvalidOperator']).required(errors['FilterConfig/MissingOperator']),
	operand: yup.mixed(),
}).required();
const groupOfFiltersSchema = yup.array().typeError(errors['FilterConfig/InvalidGroup']).of(filterSchema).min(1, errors['FilterConfig/EmptyGroup']).required(errors['FilterConfig/EmptyGroup']);
const filterConfigSchema = yup.array().typeError(errors['FilterConfig/Invalid']).of(groupOfFiltersSchema).min(1, errors['FilterConfig/Empty']).required(errors['FilterConfig/Empty']);

export const validateFilterConfig = <T>(filterConfig: any): EitherAsync<Error, FilterConfig<T>> => {
	const validation = filterConfigSchema.validate(filterConfig, {
		strict: true,
		stripUnknown: true,
	})
	.then( (filterConfig) => (
		testFilterConfigUniqueIds(filterConfig as FilterConfig<T>) 
		? Right(filterConfig as FilterConfig<T>)
		: Left(new Error(errors['FilterConfig/DuplicateOperator']))
	))
	.catch(err => Left(new Error(err.errors)))


	return EitherAsync.fromPromise(() => validation);
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