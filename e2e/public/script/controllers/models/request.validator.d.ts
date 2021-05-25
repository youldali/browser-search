import { EitherAsync } from 'purify-ts/EitherAsync';
import { Request, StoreId } from './request.model';
export interface ExtraValidators {
    getStoreExist: (storeId: StoreId) => EitherAsync<Error, boolean>;
}
export declare const validateRequest: <T>(extraValidators: ExtraValidators) => (request: any) => EitherAsync<Error, Request<T>>;
