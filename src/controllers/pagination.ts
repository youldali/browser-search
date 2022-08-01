import { EitherAsync } from 'purify-ts/EitherAsync';
import { getDocuments } from 'apis/storage.util';

import { DocumentId, QueryRequest } from './models';

const DEFAULT_DOCUMENTS_PER_PAGE = 20;
const DEFAULT_PAGE = 0;

export const getPaginatedDocuments = <T>({storeId, page = DEFAULT_PAGE, perPage = DEFAULT_DOCUMENTS_PER_PAGE}: QueryRequest<T>) =>  (documentIds: DocumentId[]): EitherAsync<Error, T[]> => {
    const begin = page * perPage;
    const end = (page + 1) * perPage;
    const paginatedDocumentIds = documentIds.slice(begin, end);

    return getDocuments<T>(storeId)(paginatedDocumentIds);
};
