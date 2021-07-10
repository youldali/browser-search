export declare const findHighestValueInObjects: (field: string) => (collection: Array<UnknownObject>) => unknown;
export declare const findIntersectionOfSortedArrays: <T>(a: T[]) => (b: T[]) => T[];
export declare const getHasOneInCommon: <T>(a: T[]) => (b: T[]) => boolean;
export declare const findElementIndexInSortedArray: <T>(a: T[]) => (searchedElement: T) => number;
export declare const transformIntoObject: (array: Array<StringOrNumber>) => Record<string, StringOrNumber>;
export declare const filterAgainstObjectKeys: (array: StringOrNumber[]) => (object: Record<string, StringOrNumber>) => StringOrNumber[];
export declare const liftInArray: <T>(a: T | T[]) => T[];
