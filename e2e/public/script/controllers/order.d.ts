import { EitherAsync } from 'purify-ts/EitherAsync';
import { ItemId, Request } from './models';
export declare const getOrderFromRequest: <T>(request: Request<T>) => (itemsIdsToSort: ItemId[]) => EitherAsync<Error, ItemId[]>;
