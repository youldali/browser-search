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

export
const lt = (a: number, b: number): boolean => a < b;

export
const lte = (a: number, b: number): boolean => a <= b;

export
const gt = (a: number, b: number): boolean => a > b;

export
const gte = (a: number, b: number): boolean => a >= b;

export
const equal = (a: unknown, b: unknown): boolean => a === b;

export
const inRangeClosed = (a: number, b: [number, number]): boolean => a >= b[0] && a <= b[1];

export
const inRangeOpen = (a: number, b: [number, number]): boolean => a > b[0] && a < b[1];

export
const inRangeOpenClosed = (a: number, b: [number, number]): boolean => a > b[0] && a <= b[1];

export
const inRangeClosedOpen = (a: number, b: [number, number]): boolean => a >= b[0] && a < b[1];

export
const containsOptimized = (a: Array<StringOrNumber>, b: StringOrNumber): boolean => findElementIndexInSortedArray(a)(b) >= 0;

export
const contains = (a: Array<StringOrNumber>, b: StringOrNumber): boolean => a.includes(b);

export const operatorToFunction =
{
	[Operators.lt]: lt,
	[Operators.lte]: lte,
	[Operators.gt]: gt,
	[Operators.gte]: gte,
	[Operators.lt]: equal,
	[Operators.inRangeClosed]: inRangeClosed,
	[Operators.inRangeOpen]: inRangeOpen,
	[Operators.inRangeClosedOpen]: inRangeClosedOpen,
	[Operators.inRangeOpenClosed]: inRangeOpenClosed,
	[Operators.contains]: contains,
	[Operators.containsOptimized]: containsOptimized,
};

