// string(key) -> [object] -> any(field value)
export const findHighestValueInObjects = (field: string) => (collection: Array<UnknownObject>): unknown => (
	collection.reduce(
		(accumulator: any, currentObject: UnknownObject): unknown => 
			accumulator > currentObject[field] ? accumulator : currentObject[field]
		, collection[0][field]
	)
);

//[a] -> [a] -> [a]
export const findIntersectionOfSortedArrays = <T>(a: T[]) => (b: T[]): T[] => {
	const 
		length1 = a.length, 
		length2 = b.length,
		intersection = [];

	let 
		i = 0, 
		j = 0;

	while(i < length1 && j < length2){
		let aI = a[i], bJ = b[j];
		if(aI > bJ)
			j++
		else if (aI < bJ)
			i++
		else{
			intersection.push(aI);
			i++;
			j++;
		}
	}

	return intersection;
};

// [a] -> [a] -> boolean
export const getHasOneInCommon = <T>(a: T[]) => (b: T[]): boolean => {
	const 
		length1 = a.length, 
		length2 = b.length;

	let 
		i = 0, 
		j = 0;

	while(i < length1 && j < length2){
		let aI = a[i], bJ = b[j];
		if(aI > bJ)
			j++
		else if (aI < bJ)
			i++
		else{
			return true;
		}
	}

	return false;
};

//[a] -> a -> number
export const findElementIndexInSortedArray = <T>(a: Array<T>) => (searchedElement: T): number => {
	let 
		startIndex = 0, 
		endIndex = a.length - 1;

	while(startIndex <= endIndex){
		let middleIndex = Math.floor( (endIndex - startIndex) / 2 + startIndex);
		let middleElement = a[middleIndex];
		if(searchedElement > middleElement)
			startIndex = middleIndex + 1;
		else if (searchedElement < middleElement)
			endIndex = middleIndex - 1;
		else
			return middleIndex;

	}
	return -1;

}

// [string | number] -> { [string] : string | number}
export const transformIntoObject = (array: Array<StringOrNumber>): Record<string, StringOrNumber> => {
	const reducer = (accumulator: Record<string, StringOrNumber>, currentValue: StringOrNumber) => {
		accumulator[currentValue] = currentValue;
		return accumulator;
	}
	return array.reduce(reducer, {});
}

// [string | number] -> { [string | number] : string | number} -> [string | number]
export const filterAgainstObjectKeys = (array: StringOrNumber[]) => (object: Record<string, StringOrNumber>) =>
	array.filter( itemId => object[itemId] !== undefined)


// a | [a] -> [a]
export const liftInArray = <T>(a: T | T[]): Array<T> => 
Array.isArray(a) ? a : [a];
