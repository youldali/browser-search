import React, { ReactElement } from 'react';
import { GenericQueryState } from 'react-browser-search';

type QuerySuspenseProps<Request, Response, Error> = {
  queryState: GenericQueryState.QueryState<Request, Response, Error>;
  fallback: () => ReactElement | null;
  loading: ReactElement | null;
  children: (data: Response) => ReactElement | null;
};

export const QuerySuspense = <Request, Response, Error>({
  queryState,
  fallback,
  loading,
  children,
}: QuerySuspenseProps<Request, Response, Error>) => {
  if (queryState.status === 'loading' || queryState.status === 'idle') {
    return loading;
  }

  if (queryState.status === 'error') {
    return fallback();
  }

  return children(queryState.response);
};
