import { compose, curry, filter, isNil, map, prop, reduce, reverse, sort, sortBy } from 'rambda';
import operators, { Operator } from 'helpers/operators';

jest.genMockFromModule('../indexedDB.api');

interface MockStore {
    [key: string]: any[]
}

interface OperatorAndValue {
    operator : Operator,
    value: unknown
}

let itemCollection: MockStore = {};

const _createOrOpenDatabase = 
(dbName: string) => 
(dbVersion: number) => 
(_: Function): Promise<Partial<IDBDatabase>> => 
    Promise.resolve({name: dbName, version: dbVersion});
export const createOrOpenDatabase = curry(_createOrOpenDatabase);


export const getNumberOfItemsInStore = 
(_: IDBDatabase) => 
(storeName: string): Promise<number> => 
    Promise.resolve(itemCollection[storeName] ? itemCollection[storeName].length : 0);


export const addDataToStore = 
(_: IDBDatabase) => 
(storeName: string) => 
(data: Object[] = []): Promise<any> => {
    itemCollection[storeName] === undefined ? 
    itemCollection[storeName] = data : 
    itemCollection[storeName] = itemCollection[storeName].concat(data);
    return Promise.resolve();
};


export const getPrimaryKeyListMatchingRange = 
(_: IDBDatabase) =>
(storeName: string) => 
(indexName: string) => 
(keyRange: IDBKeyRange) => {
    const 
        { operator, value } = getOperatorMatchingKeyRange(keyRange),
        field = indexName;

    const 
        filterCollection = filter( (item: any) => (operators as any)[operator](item[field], value) ),
        mapToId = map( (item: any) => item.id),
        filteredItemIdList = compose(mapToId, filterCollection)(itemCollection[storeName]);

    return Promise.resolve(filteredItemIdList);
}


export const iterateOverStore = 
(_: IDBDatabase) => 
(storeName: string) => 
(callBack: Function) => {
    itemCollection[storeName].forEach(element => callBack(element.id, element) );
    return Promise.resolve();
}


export const getAllUniqueKeysForIndex = 
(_: IDBDatabase) => 
(storeName: string) => 
(indexName: string) => {
    const reducerToUniqueSetOfValues = (uniqueCollection: any, currentElement: any) => {
        const 
            fieldValue = currentElement[indexName],
            mFieldValue = Array.isArray(fieldValue) ? fieldValue : [fieldValue];

        //for each element in the array, we check if the value exist, if not we push it
        mFieldValue.forEach( singleValue => uniqueCollection.indexOf(singleValue) === -1 && uniqueCollection.push(singleValue) );
        
		return uniqueCollection;
    }

    const 
        getUniqueValues = reduce(reducerToUniqueSetOfValues, []),
        operandList = compose( sort, getUniqueValues )(itemCollection[storeName]);
    
	return Promise.resolve(operandList);
};


export const getAllPrimaryKeysForindex = 
(_: IDBDatabase) => 
(storeName: string) => 
(indexName: string) => 
(reverseDirection: boolean) => {
    const reducerToSetOfValues = (primaryKeyCollection: any, currentElement: any) => {
        primaryKeyCollection.push(currentElement.id);   
		return primaryKeyCollection;
    };
    
    const
        sortCollection = sortBy(prop(indexName)),
        getPrimaryKeys = reduce(reducerToSetOfValues, []),
        primaryKeyCollection = getPrimaryKeys(sortCollection(itemCollection[storeName]))

    return Promise.resolve(reverseDirection ? reverse(primaryKeyCollection) : primaryKeyCollection);
};


export const getItemList = 
(_: IDBDatabase) => 
(storeName: string) => 
(idList: number[]): Promise<any> => {
    const itemList: any = [];

    idList.forEach( id => {
        const item = itemCollection[storeName].find( element => element.id === id)
        itemList.push(item);
    });

    return Promise.resolve(itemList);
};


const getOperatorMatchingKeyRange = (keyRange: IDBKeyRange): OperatorAndValue => {
    const { lower, upper, lowerOpen, upperOpen } = keyRange;

    if(lower === upper)
        return { operator: '===', value: lower };
    if(isNil(lower))
        return upperOpen === true ? { operator: '<', value: upper } : { operator: '<=', value: upper };
    if(isNil(upper))
        return lowerOpen === true ? { operator: '>', value: lower } : { operator: '>=', value: lower };
    if(!lowerOpen && !upperOpen)
        return { operator: 'inRangeClosed', value: [lower, upper] };
    if(lowerOpen && upperOpen)
        return { operator: 'inRangeOpen', value: [lower, upper] };
    if(lowerOpen && !upperOpen)
        return { operator: 'inRangeOpenClosed', value: [lower, upper] };
    
    return { operator: 'inRangeClosedOpen', value: [lower, upper] };
}

export const getKeyRangeMatchingOperator = 
(operator: Operator) => 
(value: any) => {
    let keyRangeMock = {};
    switch(operator){
        case '===':
        case 'isIncluded':
        case 'hasOneInCommon':
        case 'contains':
            keyRangeMock = {
                lower: value,
                upper: value,
                lowerOpen: false, 
                upperOpen: false
            };
            break;
        case '<':
            keyRangeMock = { 
                upper: value,
                lower: undefined,
                lowerOpen: true, 
                upperOpen: true 
            }
            break;
        case '<=':
            keyRangeMock = { 
                upper: value,
                lower: undefined,
                lowerOpen: true, 
                upperOpen: false 
            }
            break;
        case '>':
            keyRangeMock = { 
                lower: value,
                upper: undefined,
                lowerOpen: true, 
                upperOpen: true 
            }
            break;
        case '>=':
            keyRangeMock = { 
                lower: value,
                upper: undefined,
                lowerOpen: false, 
                upperOpen: true 
            }
            break;
        case 'inRangeClosed':
            keyRangeMock = { 
                lower: value[0],
                upper: value[1],
                lowerOpen: false,
                upperOpen: false 
            }
            break;
        case 'inRangeOpen':
            keyRangeMock = { 
                lower: value[0],
                upper: value[1],
                lowerOpen: true,
                upperOpen: true 
            }
            break;
        case 'inRangeOpenClosed':
            keyRangeMock = { 
                lower: value[0],
                upper: value[1],
                lowerOpen: true,
                upperOpen: false 
            }
            break;
        case 'inRangeClosedOpen':
            keyRangeMock = { 
                lower: value[0],
                upper: value[1],
                lowerOpen: false,
                upperOpen: true 
            }
            break;
    }

    return Object.assign({}, keyRangeMock, {operator, value});
}
