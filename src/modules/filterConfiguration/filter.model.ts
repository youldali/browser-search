import { Operator } from './operators'
import { Interval } from 'dataStructure/interval'

export type FilterId = string;
export type FilterOperand = number | string | number[] | string[] | Interval;
export interface FilterStructure {
	filterId: FilterId,
	operator: Operator,
	field: string,
	operand: FilterOperand,
	label: string
};
export type FilterConfig = FilterStructure[][];
