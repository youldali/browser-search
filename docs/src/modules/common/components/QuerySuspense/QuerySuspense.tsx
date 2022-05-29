import React, { ReactElement } from 'react';
import {
    ErrorQueryState, IdleState, LoadingQueryState, QueryState, StaleQueryState, SuccessQueryState,
} from 'react-browser-search';

type QuerySuspenseProps<Request, Response, Error, T extends QueryState<Request, Response, Error>> = {
  queryState: T;
  idle: (idleQueryState: Extract<T, IdleState>) => ReactElement | null;
  error: (errorQueryState: Extract<T, ErrorQueryState<Request, Error>>) => ReactElement | null;
  loading: (loadingQueryState: Extract<T, LoadingQueryState<Request>>) => ReactElement | null;
  stale?: (stateQueryState: Extract<T, StaleQueryState<Request, Response>>) => ReactElement | null;
  success: (successQueryState: Extract<T, SuccessQueryState<Request, Response>>) => ReactElement | null;
};

export const QuerySuspense = <Request, Response, Error, T extends QueryState<Request, Response, Error>>({
  queryState,
  error,
  idle,
  stale,
  loading,
  success,
}: QuerySuspenseProps<Request, Response, Error, T>) => {

  if (queryState.status === 'idle') {
    return idle(queryState as Extract<T, IdleState>);
  }

  if (queryState.status === 'loading') {
    return loading(queryState as Extract<T, LoadingQueryState<Request>>);
  }

  if (queryState.status === 'error') {
    return error(queryState as Extract<T, ErrorQueryState<Request, Error>>);
  }

  if (queryState.status === 'stale' && stale) {
    return stale(queryState as Extract<T, StaleQueryState<Request, Response>>);
  }

  return success(queryState as Extract<T, SuccessQueryState<Request, Response>>);
};
