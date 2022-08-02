import { EitherAsync } from 'purify-ts/EitherAsync';
import { DocumentId, QueryRequest } from './models';
export declare const getPaginatedDocuments: <T>({ storeId, page, perPage }: QueryRequest<T, string>) => (documentIds: DocumentId[]) => EitherAsync<Error, T[]>;
