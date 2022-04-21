import React, { ReactElement } from 'react';
import {
    MutationErrorQueryState, MutationIdleState, MutationLoadingQueryState, MutationQueryState,
    MutationSuccessQueryState,
} from 'react-browser-search';

type MutationQuerySuspenseProps<Request, Response, Error, T extends MutationQueryState<Request, Response, Error>> = {
  mutationQueryState: T;
  idle: (mutationIdleQueryState: Extract<T, MutationIdleState>) => ReactElement | null;
  error: (mutationErrorQueryState: Extract<T, MutationErrorQueryState<Request, Error>>) => ReactElement | null;
  loading: (mutationLoadingQueryState: Extract<T, MutationLoadingQueryState<Request>>) => ReactElement | null;
  success: (mutationSuccessQueryState: Extract<T, MutationSuccessQueryState<Request, Response>>) => ReactElement | null;
};

export const MutationQuerySuspense = <Request, Response, Error, T extends MutationQueryState<Request, Response, Error>>({
  mutationQueryState,
  error,
  idle,
  loading,
  success,
}: MutationQuerySuspenseProps<Request, Response, Error, T>) => {

  if (mutationQueryState.status === 'idle') {
    return idle(mutationQueryState as Extract<T, MutationIdleState>);
  }

  if (mutationQueryState.status === 'loading') {
    return loading(mutationQueryState as Extract<T, MutationLoadingQueryState<Request>>);
  }

  if (mutationQueryState.status === 'error') {
    return error(mutationQueryState as Extract<T, MutationErrorQueryState<Request, Error>>);
  }

  return success(mutationQueryState as Extract<T, MutationSuccessQueryState<Request, Response>>);
};
