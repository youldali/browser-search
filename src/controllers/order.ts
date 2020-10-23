import { EitherAsync } from 'purify-ts/EitherAsync'
import { transformIntoObject, filterAgainstObjectKeys } from 'helpers/array.util';
import { getAllPrimaryKeysForIndex } from 'apis/storage.util';
import { ItemId, StoreId } from './request.model';

type OrderByData = {
    field: string,
    isReversed: boolean
};

export const getOrderedItemIds = (storeId: StoreId) => (orderBy: string) => (itemsIdsToSort: ItemId[]): EitherAsync<Error, ItemId[]> => {
    const orderByData = getOrderByData(orderBy);

    const itemsIdsToSortmap = transformIntoObject(itemsIdsToSort),
    
    const eitherSortedItemIds = 
        getAllPrimaryKeysForIndex(storeId)(orderByData.field)(orderByData.isReversed)
        .map(allItemIdsSorted => filterAgainstObjectKeys(allItemIdsSorted)(itemsIdsToSortmap))

    return eitherSortedItemIds;
}

   
const getOrderByData = (orderBy: string): OrderByData => {
	const isReversed = orderBy.charAt(0) === '-' ? true : false;
	const field = orderBy.charAt(0) === '-' ? orderBy.substr(1) : orderBy;

	return {
        field,
        isReversed
    };
};


export default getOrderedBoxIdList;
