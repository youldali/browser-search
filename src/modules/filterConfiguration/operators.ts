import { findElementIndexInSortedArray } from 'helpers/array.util';

export const operators = ['lt', 'lte', 'gt', 'gte', 'equals', 'inRangeClosed', 'inRangeOpen', 'inRangeOpenClosed', 'inRangeClosedOpen', 'containsOptimized', 'contains'] as const;
export type Operator = typeof operators[number];

type OperatorFunction = (targetValue: any, operandValue: any) => boolean;

export
const lt: OperatorFunction = (a: number, b: number): boolean => a < b;

export
const lte: OperatorFunction = (a: number, b: number): boolean => a <= b;

export
const gt: OperatorFunction = (a: number, b: number): boolean => a > b;

export
const gte: OperatorFunction = (a: number, b: number): boolean => a >= b;

export
const equal: OperatorFunction = (a: unknown, b: unknown): boolean => a === b;

export
const inRangeClosed: OperatorFunction = (a: number, b: [number, number]): boolean => a >= b[0] && a <= b[1];

export
const inRangeOpen: OperatorFunction = (a: number, b: [number, number]): boolean => a > b[0] && a < b[1];

export
const inRangeOpenClosed: OperatorFunction = (a: number, b: [number, number]): boolean => a > b[0] && a <= b[1];

export
const inRangeClosedOpen: OperatorFunction = (a: number, b: [number, number]): boolean => a >= b[0] && a < b[1];

export
const containsOptimized: OperatorFunction = (a: Array<StringOrNumber>, b: StringOrNumber): boolean => findElementIndexInSortedArray(a)(b) >= 0;

export
const contains: OperatorFunction = (a: Array<StringOrNumber>, b: StringOrNumber): boolean => a.includes(b);


type OperatorToFunction = {
	[key in Operator]: OperatorFunction;
}
export const operatorToFunction: OperatorToFunction =
{
	lt: lt,
	lte: lte,
	gt: gt,
	gte: gte,
	equals: equal,
	inRangeClosed: inRangeClosed,
	inRangeOpen: inRangeOpen,
	inRangeClosedOpen: inRangeClosedOpen,
	inRangeOpenClosed: inRangeOpenClosed,
	contains: contains,
	containsOptimized: containsOptimized,
};

