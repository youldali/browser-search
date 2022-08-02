import { EitherAsync } from 'purify-ts/EitherAsync';
import { DocumentId, QueryRequest } from './models';
export declare const getOrderFromRequest: <T>(request: QueryRequest<T, string>) => (itemsIdsToSort: DocumentId[]) => EitherAsync<Error, DocumentId[]>;
