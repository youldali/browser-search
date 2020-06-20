//@flow
import type { BoxCollectionRequestData } from 'modules/actions/types';
import type { BoxId } from '../types';

import { transformIntoObject, filterAgainstObjectKeys } from 'helpers/array/utils';
import { getAllBoxesIdOrderByField } from '../services/idbStorageService';
import { curry } from 'ramda';

type OrderByData = {
    field: string,
    isReversed: boolean
};

const _getOrderedBoxIdList = async (requestData: BoxCollectionRequestData, itemIdListValidated: BoxId[]): Promise<BoxId[]> => {
    const 
        {universe, orderBy} = requestData,
        orderByData = getOrderByData(orderBy);

    const 
        validatedBoxIdObject = transformIntoObject(itemIdListValidated),
        allBoxIdListOrdered = await getAllBoxesIdOrderByField(universe, orderByData.field, orderByData.isReversed);

    return filterAgainstObjectKeys(allBoxIdListOrdered, validatedBoxIdObject);
}
const getOrderedBoxIdList = curry(_getOrderedBoxIdList);

   
const getOrderByData = (orderBy: string): OrderByData => {
	const isReversed = orderBy.charAt(0) === '-' ? true : false;
	const field = orderBy.charAt(0) === '-' ? orderBy.substr(1) : orderBy;

	return {
        field,
        isReversed
    };
};


export default getOrderedBoxIdList;
