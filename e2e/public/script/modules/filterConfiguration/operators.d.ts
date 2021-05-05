export declare const operators: readonly ["lt", "lte", "gt", "gte", "equals", "inRangeClosed", "inRangeOpen", "inRangeOpenClosed", "inRangeClosedOpen", "containsOptimized", "contains"];
export declare type Operator = typeof operators[number];
declare type OperatorFunction = (targetValue: any, operandValue: any) => boolean;
export declare const lt: OperatorFunction;
export declare const lte: OperatorFunction;
export declare const gt: OperatorFunction;
export declare const gte: OperatorFunction;
export declare const equal: OperatorFunction;
export declare const inRangeClosed: OperatorFunction;
export declare const inRangeOpen: OperatorFunction;
export declare const inRangeOpenClosed: OperatorFunction;
export declare const inRangeClosedOpen: OperatorFunction;
export declare const containsOptimized: OperatorFunction;
export declare const contains: OperatorFunction;
declare type OperatorToFunction = {
    [key in Operator]: OperatorFunction;
};
export declare const operatorToFunction: OperatorToFunction;
export {};
