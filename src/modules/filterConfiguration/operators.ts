import { findElementIndexInSortedArray } from 'helpers/array.util';

export enum Operators {
	lt = '<',
	lte = '<=',
	gt = '>',
	gte = '>=',
	equals = '==',
	inRangeClosed = 'inRangeClosed',
	inRangeOpen = 'inRangeOpen',
	inRangeOpenClosed = 'inRangeOpenClosed',
	inRangeClosedOpen = 'inRangeClosedOpen',
	containsOptimized = 'containsOptimized',
	contains = 'contains',
}

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

export const operatorToFunction =
{
	[Operators.lt]: lt,
	[Operators.lte]: lte,
	[Operators.gt]: gt,
	[Operators.gte]: gte,
	[Operators.equals]: equal,
	[Operators.inRangeClosed]: inRangeClosed,
	[Operators.inRangeOpen]: inRangeOpen,
	[Operators.inRangeClosedOpen]: inRangeClosedOpen,
	[Operators.inRangeOpenClosed]: inRangeOpenClosed,
	[Operators.contains]: contains,
	[Operators.containsOptimized]: containsOptimized,
};

