import { EitherAsync } from 'purify-ts/EitherAsync'
import { getItems } from 'apis/storage.util';
import { Item, ItemId, Request } from './request.model';

export const getPaginatedItems = ({storeId, page}: Request) => (perPage: number) =>  (itemIds: ItemId[]): EitherAsync<Error, Item[]> => {
    const begin = (page - 1) * perPage;
    const end = page * perPage;
    const paginatedItemIds = itemIds.slice(begin, end);

    return getItems(storeId)(paginatedItemIds);
};

export default getPaginatedBoxList;
