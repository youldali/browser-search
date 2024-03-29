import { EitherAsync } from 'purify-ts/EitherAsync';
import { filterAgainstObjectKeys, transformIntoObject } from 'helpers/array.util';
import { getAllPrimaryKeysForIndex } from 'apis/storage.util';
import { Right } from 'purify-ts/Either';
import { isNil } from 'ramda';

import { DocumentId, QueryRequest } from './models';

type OrderParams<T> = Required<Pick<QueryRequest<T>, 'storeId' | 'orderBy' | 'orderDirection'>>

export const getOrderFromRequest = <T>(request: QueryRequest<T>) => (itemsIdsToSort: DocumentId[]): EitherAsync<Error, DocumentId[]> => {
    const { orderBy, orderDirection } = request;
    return isNil(orderBy) 
    ? getDefaultOrder(itemsIdsToSort)
    : getOrderedDocumentIds({...request, orderBy, orderDirection: orderDirection ?? 'ASC'})(itemsIdsToSort);
}

const getOrderedDocumentIds = <T>({ storeId, orderBy, orderDirection}: OrderParams<T>) => (itemsIdsToSort: DocumentId[]): EitherAsync<Error, DocumentId[]> => {
    const isReversed = orderDirection === 'DESC';
    
    const itemsIdsToSortmap = transformIntoObject(itemsIdsToSort);
    
    const eitherSortedDocumentIds = 
        getAllPrimaryKeysForIndex(storeId)(orderBy)(isReversed)
        .map(allDocumentIdsSorted => filterAgainstObjectKeys(allDocumentIdsSorted)(itemsIdsToSortmap))

    return eitherSortedDocumentIds;
}


const getDefaultOrder = (itemsIdsToSort: DocumentId[]): EitherAsync<Error, DocumentId[]> => (
    EitherAsync.liftEither(Right(itemsIdsToSort)) 
)
