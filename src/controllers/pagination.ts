import { EitherAsync } from 'purify-ts/EitherAsync'
import { getItems } from 'apis/storage.util';
import { Item, ItemId, Request } from './request.model';

const DEFAULT_ITEMS_PER_PAGE = 20;
const DEFAULT_PAGE = 1;

export const getPaginatedItems = ({storeId, page = DEFAULT_PAGE, perPage = DEFAULT_ITEMS_PER_PAGE}: Request) =>  (itemIds: ItemId[]): EitherAsync<Error, Item[]> => {
    const begin = (page - 1) * perPage;
    const end = page * perPage;
    const paginatedItemIds = itemIds.slice(begin, end);

    return getItems(storeId)(paginatedItemIds);
};
