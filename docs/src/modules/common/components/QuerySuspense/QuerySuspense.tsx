import React, { ReactElement } from 'react';
import { GenericQueryState } from 'react-browser-search';

type QuerySuspenseProps<Request, Response, Error> = {
  queryState: GenericQueryState.QueryState<Request, Response, Error>;
  idle: (idleQueryState: GenericQueryState.IdleState) => ReactElement | null;
  error: (errorQueryState: GenericQueryState.ErrorQueryState<Request, Error>) => ReactElement | null;
  loading: (loadingQueryState: GenericQueryState.LoadingQueryState<Request>) => ReactElement | null;
  stale: (stateQueryState: GenericQueryState.StaleQueryState<Request, Response>) => ReactElement | null;
  success: (successQueryState: GenericQueryState.SuccessQueryState<Request, Response>) => ReactElement | null;
};

export const QuerySuspense = <Request, Response, Error>({
  queryState,
  error,
  idle,
  stale,
  loading,
  success,
}: QuerySuspenseProps<Request, Response, Error>) => {

  if (queryState.status === 'idle') {
    return idle(queryState);
  }

  if (queryState.status === 'loading') {
    return loading(queryState);
  }

  if (queryState.status === 'error') {
    return error(queryState);
  }

  if (queryState.status === 'stale') {
    return stale(queryState);
  }

  return success(queryState);
};
