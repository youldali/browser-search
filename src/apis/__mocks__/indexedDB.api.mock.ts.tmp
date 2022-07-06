import { compose, filter, map, prop, reduce, reverse, sort, sortBy } from 'rambda';
import { Operators, operatorToFunction } from 'modules/filterConfiguration/operators';
import { FieldsToIndex } from '../indexedDB.api';

jest.genMockFromModule('../indexedDB.api');

interface MockStore {
    [key: string]: any[]
}

interface MockedIDBKeyRange extends IDBKeyRange {
    operator: Operators,
    value: any,
}

let itemCollection: MockStore = {};

export const createOrOpenDatabase = 
(dbName: string) => 
(dbVersion: number) => 
(_: Function): Promise<Partial<IDBDatabase>> => 
    Promise.resolve({name: dbName, version: dbVersion});

export const createObjectStore = 
(storeName: string) =>
(_: FieldsToIndex) => 
(_: string) => //keyPath
(_: IDBDatabase) => itemCollection[storeName] = [];

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
(keyRange: MockedIDBKeyRange) => {
    const 
        { operator, value } = keyRange,
        field = indexName;

    const 
        filterCollection = filter( (item: any) => (operatorToFunction as any)[operator](item[field], value) ),
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


export const getKeyRangeMatchingOperator = 
(operator: Operators) => 
(value: any): MockedIDBKeyRange => {
    let keyRangeMock: IDBKeyRange;
    switch(operator){
        case Operators.equals:
        case Operators.contains:
        case Operators.containsOptimized:
            keyRangeMock = {
                lower: value,
                upper: value,
                lowerOpen: false, 
                upperOpen: false,
                includes: (key) => value === key,
            };
            break;
        case Operators.lt:
            keyRangeMock = { 
                upper: value,
                lower: undefined,
                lowerOpen: true, 
                upperOpen: true,
                includes: (key) => key < value,
            }
            break;
        case Operators.lte:
            keyRangeMock = { 
                upper: value,
                lower: undefined,
                lowerOpen: true, 
                upperOpen: false,
                includes: (key) => key <= value,
            }
            break;
        case Operators.gt:
            keyRangeMock = { 
                lower: value,
                upper: undefined,
                lowerOpen: true, 
                upperOpen: true,
                includes: (key) => key > value,
            }
            break;
        case Operators.gte:
            keyRangeMock = { 
                lower: value,
                upper: undefined,
                lowerOpen: false, 
                upperOpen: true,
                includes: (key) => key >= value,
            }
            break;
        case Operators.inRangeClosed:
            keyRangeMock = { 
                lower: value[0],
                upper: value[1],
                lowerOpen: false,
                upperOpen: false,
                includes: (key) => key >= value[1] && key <= value[1],
            }
            break;
        case Operators.inRangeOpen:
            keyRangeMock = { 
                lower: value[0],
                upper: value[1],
                lowerOpen: true,
                upperOpen: true,
                includes: (key) => key > value[1] && key < value[1],
            }
            break;
        case Operators.inRangeOpenClosed:
            keyRangeMock = { 
                lower: value[0],
                upper: value[1],
                lowerOpen: true,
                upperOpen: false,
                includes: (key) => key > value[1] && key <= value[1],
            }
            break;
        case Operators.inRangeClosedOpen:
            keyRangeMock = { 
                lower: value[0],
                upper: value[1],
                lowerOpen: false,
                upperOpen: true,
                includes: (key) => key >= value[1] && key < value[1],
            }
            break;
    }

    return Object.assign({}, keyRangeMock, {operator, value});
}
