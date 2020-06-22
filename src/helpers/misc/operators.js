//@flow
import { getHasOneInCommon, findElementIndexInSortedArray } from 'helpers/array/utils';

export
const inferior = (a: any, b: any): boolean => a < b;

export
const inferiorOrEqual = (a: any, b: any): boolean => a <= b;

export
const superior = (a: any, b: any): boolean => a > b;

export
const superiorOrEqual = (a: any, b: any): boolean => a >= b;

export
const equal = (a: any, b: any): boolean => a == b;

export
const equalStrict = (a: any, b: any): boolean => a === b;

export
const inRangeClosed = (a: number, b: [number, number]): boolean => a >= b[0] && a <= b[1];

export
const inRangeOpen = (a: number, b: [number, number]): boolean => a > b[0] && a < b[1];

export
const inRangeOpenClosed = (a: number, b: [number, number]): boolean => a > b[0] && a <= b[1];

export
const inRangeClosedOpen = (a: number, b: [number, number]): boolean => a >= b[0] && a < b[1];

export
const contains = <T: string | number>(a: Array<T>, b: T): boolean => findElementIndexInSortedArray(a, b) >= 0;

export
const isIncluded = <T: string | number>(a: T, b: Array<T>): boolean => findElementIndexInSortedArray(b, a) >= 0;

export
const hasOneInCommon = <T: string[] | number[]>(a: T, b: T): boolean => getHasOneInCommon(a, b);

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
	isIncluded,
	hasOneInCommon,
	contains
};

