import Joi from '@hapi/joi';
import { Operators } from './operators'
import { FilterConfig } from './filter.model'
import { Either, Left, Right } from 'purify-ts/Either'
import { isNil } from 'rambda'

const filterContentSchema = Joi.object({
	field: Joi.string().alphanum(),
	operator: Joi.string().valid(...Object.values(Operators)).label('Operator check'),
	operand: Joi.any(),
});
const filterSchema = Joi.object().pattern(Joi.string().min(1), filterContentSchema);
const groupOfFiltersSchema = Joi.array().items(filterSchema).min(1);
const filterConfigSchema = Joi.array().items(groupOfFiltersSchema).min(1);

export const validateFilterConfig = (filterConfig: FilterConfig): Either<string, FilterConfig> => {
	const validation = filterConfigSchema.validate(filterConfig);
	return isNil(validation.error) ? Right(filterConfig) : Left(validation.error.message);	
}