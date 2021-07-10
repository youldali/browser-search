import { EitherAsync } from 'purify-ts/EitherAsync';
import { DocumentId, Request } from './models';
export declare const getPaginatedDocuments: <T>({ storeId, page, perPage }: Request<T, string>) => (documentIds: DocumentId[]) => EitherAsync<Error, T[]>;
