import { EitherAsync } from 'purify-ts/EitherAsync';
import { Item, ItemId, Request } from './models';
export declare const getPaginatedItems: <T>({ storeId, page, perPage }: Request<T>) => (itemIds: ItemId[]) => EitherAsync<Error, Item[]>;
