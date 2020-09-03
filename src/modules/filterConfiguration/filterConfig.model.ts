import { Operators } from './operators'
import { Interval } from 'dataStructures/interval'

/**
 * Describes the JSON representation of the filter configuration used as a base to create filtering functions
 * Example:
 * [ // FilterConfig
 *   [ // GroupOfFilters
 *     { id: 'priceMin', field: 'price', operator: '>', operand: 200 }, // Filter
 *     { id: 'priceMax', field: 'price', operator: '<', operand: 500}
 *   ],
 *   [
 *     { id: 'numberOfPeople' field: 'people', operator: '==', operand: 3 }
 *   ]
 * ]
 */

export type FilterId = string;
export type FilterOperand = number | string | number[] | string[] | Interval;
export interface Filter {
	id: string,
	field: string,
	operator: Operators,
	operand: FilterOperand,
};
export type GroupOfFilters = Filter[];
export type FilterConfig = GroupOfFilters[];
