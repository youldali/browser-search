import { EitherAsync } from 'purify-ts/EitherAsync';
import { DocumentId, Request } from './models';
export declare const getOrderFromRequest: <T>(request: Request<T, string>) => (itemsIdsToSort: DocumentId[]) => EitherAsync<Error, DocumentId[]>;
