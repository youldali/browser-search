import { EitherAsync } from 'purify-ts/EitherAsync';
import { QueryRequest, StoreId } from './request.model';
export interface ExtraValidators {
    getStoreExist: (storeId: StoreId) => EitherAsync<Error, boolean>;
}
export declare const validateRequest: <T>(extraValidators: ExtraValidators) => (request: any) => EitherAsync<Error, QueryRequest<T, string>>;
