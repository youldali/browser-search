import Joi from '@hapi/joi';
import { Operators } from './operators'
import { FilterConfig } from './filterConfig.model'
import { Either, Left, Right } from 'purify-ts/Either'
import { isNil } from 'rambda'

/**
 * Validates the JSON filter config passed to the library
 * If invalid, returns a Left(error)
 */

const filterSchemaErrorMessage = 'Group of filters cannot be empty';
const filterConfigSchemaErrorMessage = 'Filter configuration cannot be empty';
const filterConfigInvalidOperatorErrorMessage = 'The operator is invalid';

const filterSchema = Joi.object({
	id: Joi.string(),
	field: Joi.string().alphanum(),
	operator: Joi.string().valid(...Object.values(Operators)).label(filterConfigInvalidOperatorErrorMessage),
	operand: Joi.any(),
});
const groupOfFiltersSchema = Joi.array().items(filterSchema).min(1).message(filterSchemaErrorMessage);
const filterConfigSchema = Joi.array().items(groupOfFiltersSchema).min(1).message(filterConfigSchemaErrorMessage);

export const validateFilterConfig = (filterConfig: any): Either<Error, FilterConfig> => {
	const validation = filterConfigSchema.validate(filterConfig);
	return isNil(validation.error) ? Right(filterConfig) : Left(Error(validation.error.message));	
}
