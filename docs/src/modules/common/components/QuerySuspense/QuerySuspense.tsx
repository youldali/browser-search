import React, { ReactElement } from 'react';
import { GenericQueryState } from 'react-browser-search';

type QuerySuspenseProps<Request, Response, Error, T extends GenericQueryState.QueryState<Request, Response, Error>> = {
  queryState: T;
  idle: (idleQueryState: Extract<T, GenericQueryState.IdleState>) => ReactElement | null;
  error: (errorQueryState: Extract<T, GenericQueryState.ErrorQueryState<Request, Error>>) => ReactElement | null;
  loading: (loadingQueryState: Extract<T, GenericQueryState.LoadingQueryState<Request>>) => ReactElement | null;
  stale: (stateQueryState: Extract<T, GenericQueryState.StaleQueryState<Request, Response>>) => ReactElement | null;
  success: (successQueryState: Extract<T, GenericQueryState.SuccessQueryState<Request, Response>>) => ReactElement | null;
};

export const QuerySuspense = <Request, Response, Error, T extends GenericQueryState.QueryState<Request, Response, Error>>({
  queryState,
  error,
  idle,
  stale,
  loading,
  success,
}: QuerySuspenseProps<Request, Response, Error, T>) => {

  if (queryState.status === 'idle') {
    return idle(queryState as Extract<T, GenericQueryState.IdleState>);
  }

  if (queryState.status === 'loading') {
    return loading(queryState as Extract<T, GenericQueryState.LoadingQueryState<Request>>);
  }

  if (queryState.status === 'error') {
    return error(queryState as Extract<T, GenericQueryState.ErrorQueryState<Request, Error>>);
  }

  if (queryState.status === 'stale') {
    return stale(queryState as Extract<T, GenericQueryState.StaleQueryState<Request, Response>>);
  }

  return success(queryState as Extract<T, GenericQueryState.SuccessQueryState<Request, Response>>);
};
