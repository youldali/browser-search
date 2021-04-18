import { EitherAsync } from 'purify-ts/EitherAsync'
import { transformIntoObject, filterAgainstObjectKeys } from 'helpers/array.util';
import { getAllPrimaryKeysForIndex } from 'apis/storage.util';
import { ItemId, Request } from './request.model';
import { liftEither } from 'purify-ts/EitherAsync'
import { Right } from 'purify-ts/Either'
import { isNil } from 'ramda'

type Props = Required<Pick<Request, 'storeId' | 'orderBy' | 'orderDirection'>>

export const getOrderFromRequest = (request: Request) => (itemsIdsToSort: ItemId[]): EitherAsync<Error, ItemId[]> {
    const { orderBy, orderDirection } = request;
    return isNil(orderBy) 
    ? getDefaultOrder(itemsIdsToSort)
    : getOrderedItemIds({...request, orderBy, orderDirection: orderDirection ?? 'ASC'})(itemsIdsToSort);
}

const getOrderedItemIds = ({ storeId, orderBy, orderDirection}: Props) => (itemsIdsToSort: ItemId[]): EitherAsync<Error, ItemId[]> => {
    const isReversed = orderDirection === 'DESC';
    
    const itemsIdsToSortmap = transformIntoObject(itemsIdsToSort);
    
    const eitherSortedItemIds = 
        getAllPrimaryKeysForIndex(storeId)(orderBy)(isReversed)
        .map(allItemIdsSorted => filterAgainstObjectKeys(allItemIdsSorted)(itemsIdsToSortmap))

    return eitherSortedItemIds;
}


const getDefaultOrder = (itemsIdsToSort: ItemId[]): EitherAsync<Error, ItemId[]> => (
    liftEither(Right(itemsIdsToSort)) 
)
