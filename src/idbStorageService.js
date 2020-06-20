//@flow

import type { BoxId, Box, FieldsToIndex, FieldsToIndexByUniverse, FilterStructure } from '../types';

import { createOrOpenDatabase, addDataToStore, getAllPrimaryKeysForindex, getNumberOfItemsInStore, getPrimaryKeyListMatchingRange, getItemList, getAllUniqueKeysForIndex, getKeyRangeMatchingOperator, iterateOverStore } from 'helpers/storage/idbStorage';
import { curry, curryN, identity, mapObjIndexed, memoizeWith } from 'ramda';
import storageConfig from '../config/storage.config';
import fetchBoxListService from './fetchBoxListService';

const { dbName, dbVersion, fieldsToIndexByUniverse } = storageConfig;

export
const memoizeByUniverse = (keyGenerationFunction: Function, f: Function) => {
    let cache = {};
    let universeCache = '';
    return curryN(
        f.length,
        (universe: string, ...args) => {
            if(universeCache !== universe){
                cache = {};
                universeCache = universe;
            }

            const key = keyGenerationFunction(universe, ...args);
            return cache[key] ? cache[key] : (cache[key] = f(universe, ...args) );
        }
    );
};


const _createUniversesStores = (fieldsToIndexByUniverse: FieldsToIndexByUniverse, db: IDBDatabase) => {
    const createUniverseStore = (fieldsToIndex: FieldsToIndex, universe: string) => {
        const 
            objectStore = db.createObjectStore(universe, { keyPath: "id" }),
            fieldsToIndexTuples = Object.entries(fieldsToIndex);
    
        //$FlowFixMe
        fieldsToIndexTuples.forEach( ([indexName, indexConfig]) => objectStore.createIndex(indexName, indexName, indexConfig || {}) );
    };

    mapObjIndexed(createUniverseStore, fieldsToIndexByUniverse);
}
const createUniversesStores = curry(_createUniversesStores);


const addDataToUniverse = (() => {
    const isFetching = {};

    return async (db: IDBDatabase, universe: string) => {
        if(isFetching[universe])
            return;
        
        isFetching[universe] = true;
        const response = await fetchBoxListService(universe);
        addDataToStore(db, universe, response.data);
        isFetching[universe] = false;

        return true;
    }
})();


const _openGiftSearchDatabase = async (universe: string) => {
    const db = await createOrOpenDatabase(dbName, dbVersion, createUniversesStores(fieldsToIndexByUniverse));
    await getNumberOfItemsInStore(db, universe) || await addDataToUniverse(db, universe);
    return db;
};
const openGiftSearchDatabase = memoizeWith(identity, _openGiftSearchDatabase);


export
const getNumberOfBoxes = async (universe: string) => {
    const db = await createOrOpenDatabase(dbName, dbVersion, createUniversesStores(fieldsToIndexByUniverse));
    return getNumberOfItemsInStore(db, universe);
}


const _getItemIdListMatchingSingleFilter = async (universe: string, filterStructure: FilterStructure): Promise<BoxId[]> => {
    const 
        db = await openGiftSearchDatabase(universe),
        { field, operator, operand } = filterStructure;

    return getPrimaryKeyListMatchingRange(db, universe, field, getKeyRangeMatchingOperator(operator, operand));
};
export const getItemIdListMatchingSingleFilter = memoizeByUniverse(
    (universe: string, filterStructure: FilterStructure) => universe + filterStructure.filterName,
    _getItemIdListMatchingSingleFilter
);


const _getOperandList = async (universe: string, field: string): Promise<BoxId[]> => {
    const db = await openGiftSearchDatabase(universe);
    return getAllUniqueKeysForIndex(db, universe, field);
}
export const getOperandList = memoizeByUniverse(
    (universe: string, field: string) => universe + field,
    _getOperandList
);



const _getBoxesList = async (universe: string, idList: BoxId[]): Promise<Box[]> => {
    const db = await openGiftSearchDatabase(universe);
    return getItemList(db, universe, idList);
}
export const getBoxesList = curry(_getBoxesList);


const _iterateOverBoxes = async (universe: string, callBack: Function): Promise<any> => {
    const db = await openGiftSearchDatabase(universe);
    return iterateOverStore(db, universe, callBack)
}
export const iterateOverBoxes = curry(_iterateOverBoxes);


const _getAllBoxesIdOrderByField = async (universe: string, field: string, isReversedDirection: boolean): Promise<BoxId[]> => {
    const db = await openGiftSearchDatabase(universe);
    return getAllPrimaryKeysForindex(db, universe, field, isReversedDirection);
};

export const getAllBoxesIdOrderByField = memoizeByUniverse(
    (universe: string, field: string, isReversedDirection: boolean) => universe + field + isReversedDirection.toString(),
    _getAllBoxesIdOrderByField
);


export
const getAllBoxesId = async (universe: string, isReversedDirection: boolean): Promise<BoxId[]> => {
    const db = await openGiftSearchDatabase(universe);
    return getAllPrimaryKeysForindex(db, universe, 'id', isReversedDirection);
};