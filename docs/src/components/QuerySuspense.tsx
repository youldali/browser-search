import React, { ReactElement } from 'react';
import { QueryState, SearchReponse } from './browserSearchHooks';

type QuerySuspenseProps<T> = {
  queryState: QueryState<T>;
  fallback: () => ReactElement | null;
  loading: ReactElement | null;
  children: (data: SearchReponse<T>) => ReactElement | null;
};

export const QuerySuspense = <T extends any>({
  queryState,
  fallback,
  loading,
  children,
}: QuerySuspenseProps<T>) => {
  if (queryState.status === 'loading' || queryState.status === 'idle') {
    return loading;
  }

  if (queryState.status === 'error') {
    return fallback();
  }

  return children(queryState.response);
};
