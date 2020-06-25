import { Operators } from './operators'
import { Interval } from 'dataStructure/interval'
import Joi from '@hapi/joi';

export type FilterId = string;
export type FilterOperand = number | string | number[] | string[] | Interval;
export interface FilterContent {
	field: string,
	operator: Operators,
	operand: FilterOperand,
};
export type Filter = Dictionary<FilterContent>; //key is FilterId
export type GroupOfFilters = Filter[];
export type FilterConfig = GroupOfFilters[];


const filterContentSchema = Joi.object({
	field: Joi.string().alphanum(),
	operator: Joi.string().valid('apple', 'banana'),
	operand: Joi.string(),
});
const filterSchema = Joi.object().pattern(Joi.string().min(1), filterContentSchema);
const groupOfFiltersSchema = Joi.array().items(filterSchema).min(1);
const filterConfigSchema = Joi.array().items(groupOfFiltersSchema).min(1);

Joi.array().items(Joi.string().valid('a', 'b'));