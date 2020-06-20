import { comparator, compose, curry, filter, map, prop, reduce, reverse, sort, sortBy } from 'ramda';
import operators from 'helpers/misc/operators';
import createInterval from 'helpers/dataStructure/interval';

jest.genMockFromModule('../idbStorage');
let itemCollection = {};

const _createOrOpenDatabase = (dbName: string, dbVersion: number, onUpgradeCallback: Function): Promise<IDBDatabase> => 
    Promise.resolve({dbName, dbVersion});
export const createOrOpenDatabase = curry(_createOrOpenDatabase);


export const _getNumberOfItemsInStore = (db: IDBDatabase, storeName: string):Promise<number> => 
    Promise.resolve(itemCollection[storeName] ? itemCollection[storeName].length : 0);
export const getNumberOfItemsInStore = curry(_getNumberOfItemsInStore);


const _addDataToStore = (db: IDBDatabase, storeName: string, data: Object[] = []): Promise<any> => {
    itemCollection[storeName] === undefined ? itemCollection[storeName] = data : itemCollection[storeName] = itemCollection[storeName].concat(data);
    return Promise.resolve();
};
export const addDataToStore = curry(_addDataToStore);


const _getPrimaryKeyListMatchingRange = (db: IDBDatabase, storeName: string, indexName: string, keyRange: IDBKeyRange) => {
    const 
        { operator, value } = keyRange,
        field = indexName;

    const 
        filterCollection = filter( item => operators[operator](item[field], value) ),
        mapToId = map( item => item.id),
        filteredItemIdList = compose(mapToId, filterCollection)(itemCollection[storeName]);

    return Promise.resolve(filteredItemIdList);
}
export const getPrimaryKeyListMatchingRange = curry(_getPrimaryKeyListMatchingRange);


const _iterateOverStore = (db: IDBDatabase, storeName: string, callBack: Function)=> {
    itemCollection[storeName].forEach(element => callBack(element.id, element) );
    return Promise.resolve();
}
export const iterateOverStore = curry(_iterateOverStore);


const _getAllUniqueKeysForIndex = (db: IDBDatabase, storeName: string, indexName: string) => {
    const reducerToUniqueSetOfValues = (uniqueCollection, currentElement) => {
        const 
            fieldValue = currentElement[indexName],
            mFieldValue = Array.isArray(fieldValue) ? fieldValue : [fieldValue];

        //for each elt in the array, we check if the value exist, if not we push it
        mFieldValue.forEach( singleValue => uniqueCollection.indexOf(singleValue) === -1 && uniqueCollection.push(singleValue) );
        
		return uniqueCollection;
    }

    const 
        sortCollection = sort(comparator( (a, b) => a < b )),
        getUniqueValues = reduce(reducerToUniqueSetOfValues, []),
        operandList = compose( sortCollection, getUniqueValues )(itemCollection[storeName]);
    
	return Promise.resolve(operandList);
};
export const getAllUniqueKeysForIndex = curry(_getAllUniqueKeysForIndex);



const _getAllPrimaryKeysForindex = (db: IDBDatabase, storeName: string, indexName: string, reverseDirection: boolean) => {
    const reducerToSetOfValues = (primaryKeyCollection, currentElement) => {
        primaryKeyCollection.push(currentElement.id);   
		return primaryKeyCollection;
    };
    
    const
        sortCollection = sortBy(prop(indexName)),
        getPrimaryKeys = reduce(reducerToSetOfValues, []),
        primaryKeyCollection = compose(getPrimaryKeys, sortCollection)(itemCollection[storeName])

    return Promise.resolve(reverseDirection ? reverse(primaryKeyCollection) : primaryKeyCollection);
};
export const getAllPrimaryKeysForindex = curry(_getAllPrimaryKeysForindex);


const _getItemList = (db: IDBDatabase, storeName: string, idList: number[]): Promise<any> => {
    const itemList = [];

    idList.forEach( id => {
        const item = itemCollection[storeName].find( element => element.id === id)
        itemList.push(item);
    });

    return Promise.resolve(itemList);
};
export const getItemList = curry(_getItemList);


const _getKeyRangeMatchingOperator = (operator: Operator, value: any) => {
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
export const getKeyRangeMatchingOperator = curry(_getKeyRangeMatchingOperator);