import { getHasOneInCommon, findElementIndexInSortedArray } from 'helpers/array.util';

export type Operator = 
    '<' | '<=' | '>' | '>=' | '==' | '===' | 
    'inRangeClosed' | 'inRangeOpen' | 'inRangeClosedOpen' | 'inRangeOpenClosed' |
	'isIncluded' | 'contains' | 'hasOneInCommon';
	
export
const inferior = (a: number, b: number): boolean => a < b;

export
const inferiorOrEqual = (a: number, b: number): boolean => a <= b;

export
const superior = (a: number, b: number): boolean => a > b;

export
const superiorOrEqual = (a: number, b: number): boolean => a >= b;

export
const equal = (a: unknown, b: unknown): boolean => a == b;

export
const equalStrict = (a: unknown, b: unknown): boolean => a === b;

export
const inRangeClosed = (a: number, b: [number, number]): boolean => a >= b[0] && a <= b[1];

export
const inRangeOpen = (a: number, b: [number, number]): boolean => a > b[0] && a < b[1];

export
const inRangeOpenClosed = (a: number, b: [number, number]): boolean => a > b[0] && a <= b[1];

export
const inRangeClosedOpen = (a: number, b: [number, number]): boolean => a >= b[0] && a < b[1];

export
const contains = (a: Array<unknown>, b: unknown): boolean => findElementIndexInSortedArray(a)(b) >= 0;


export default
{
	'<': inferior,
	'<=': inferiorOrEqual,
	'>': superior,
	'>=': superiorOrEqual,
	'==': equal,
	'===': equalStrict,
	inRangeClosed,
	inRangeOpen,
	inRangeClosedOpen,
	inRangeOpenClosed,
	contains,
};

