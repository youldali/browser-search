import * as BS from 'browser-search';
import { Reducer, useCallback, useContext, useEffect, useReducer } from 'react';

import { BrowserSearchContext } from '../provider';
import * as GenericQueryState from '../queryState';
import { areRequestsEqual } from '../request';

type RequestPayload<Document, TFilterId extends string> = BS.Request<Document, TFilterId>

export type SearchResponse<Document, TFilterId extends string = string> = Omit<BS.SearchResponse<Document, TFilterId>, '_cacheStatus_'>;

export interface IdleState extends GenericQueryState.IdleState {
}

export interface LoadingQueryState<Document, TFilterId extends string = string> extends GenericQueryState.LoadingQueryState<RequestPayload<Document, TFilterId>>  {
  abort: BS.AbortSearch;
}

export interface SuccessQueryState<Document, TFilterId extends string = string> extends GenericQueryState.SuccessQueryState<RequestPayload<Document, TFilterId>, SearchResponse<Document, TFilterId>> {
}

export interface StaleQueryState<Document, TFilterId extends string = string> extends GenericQueryState.StaleQueryState<RequestPayload<Document, TFilterId>, SearchResponse<Document, TFilterId>> {
  abort: BS.AbortSearch;
}
export interface ErrorQueryState<Document, TFilterId extends string = string> extends GenericQueryState.ErrorQueryState<RequestPayload<Document, TFilterId>, Error> {
}

export type QueryState<Document, TFilterId extends string = string> = IdleState | LoadingQueryState<Document, TFilterId> | SuccessQueryState<Document, TFilterId> | StaleQueryState<Document, TFilterId> | ErrorQueryState<Document, TFilterId>;


export type SearchStartedAction<Document, TFilterId extends string = string> = { type: 'searchStarted'; request: BS.Request<Document, TFilterId>; abort: BS.AbortSearch}
export type SearchCompletedAction<Document, TFilterId extends string = string> = { type: 'searchCompleted'; response: BS.SearchResponse<Document, TFilterId>; request: BS.Request<Document, TFilterId>;}
export type SearchFailedAction<Document, TFilterId extends string = string> = { type: 'searchFailed'; request: BS.Request<Document, TFilterId>; error: Error};

export type Action<Document, TFilterId extends string = string> =
  | SearchStartedAction<Document, TFilterId>
  | SearchCompletedAction<Document, TFilterId>
  | SearchFailedAction<Document, TFilterId>;
  
type QueryReducer<Document, TFilterId extends string = string> = Reducer<QueryState<Document, TFilterId>, Action<Document, TFilterId>>;

const initialState: IdleState = {
  status: 'idle',
  isFetching: false,
};


const fromIdleOrErrorOrLoadingToLoading = <Document, TFilterId extends string = string>(_: IdleState | LoadingQueryState<Document, TFilterId> | ErrorQueryState<Document, TFilterId>, action: SearchStartedAction<Document, TFilterId>): LoadingQueryState<Document, TFilterId> => (
  {
    status: 'loading',
    request: action.request,
    abort: action.abort,
    isFetching: true,
  }
)

const fromLoadingOrStaleToSuccess = <Document, TFilterId extends string = string>(_: LoadingQueryState<Document, TFilterId> | StaleQueryState<Document, TFilterId>, action: SearchCompletedAction<Document, TFilterId>): SuccessQueryState<Document, TFilterId> => (
  {
    status: 'success',
    request: action.request,
    response: action.response,
    isFetching: false,
  }
)

const fromLoadingOrStaleToError = <Document, TFilterId extends string = string>(_: LoadingQueryState<Document, TFilterId> | StaleQueryState<Document, TFilterId>, action: SearchFailedAction<Document, TFilterId>): ErrorQueryState<Document, TFilterId> => (
  {
    status: 'error',
    request: action.request,
    error: action.error,
    isFetching: false,
  }
)

const fromSuccessOrStaleToStale = <Document, TFilterId extends string = string>(state: SuccessQueryState<Document, TFilterId> | StaleQueryState<Document, TFilterId>, action: SearchStartedAction<Document, TFilterId>): StaleQueryState<Document, TFilterId> => (
  {
    status: 'stale',
    request: state.request,
    response: state.response,
    newRequest: action.request,
    abort: action.abort,
    isFetching: true,
  }
)

export const reducer = <Document, TFilterId extends string = string>(state: QueryState<Document, TFilterId>, action: Action<Document, TFilterId>): QueryState<Document, TFilterId> => {
  switch (action.type) {
    case 'searchStarted': {
      if(state.isFetching && !areRequestsEqual(state.request, action.request)) {
        state.abort();
      }

      switch(state.status) {
        case 'idle':
        case 'error':
        case 'loading':
          return fromIdleOrErrorOrLoadingToLoading(state, action);
        default:
          return fromSuccessOrStaleToStale(state, action);
      }
    }

    case 'searchCompleted': {
      switch(state.status) {
        case 'loading':
        case 'stale':
          return fromLoadingOrStaleToSuccess(state, action);
        default:
          return state;
      }
    }

    case 'searchFailed': {
      switch(state.status) {
        case 'loading':
        case 'stale':
          return fromLoadingOrStaleToError(state, action);
        default:
          return state;
      }
    }
 
    default:
      return state;
  }
}


export const useQuery = <Document, TFilterId extends string = string>(request: BS.Request<Document, TFilterId>): QueryState<Document, TFilterId> => {
  const queryClient = useContext(BrowserSearchContext);
  const [state, dispatch] = useReducer<QueryReducer<Document, TFilterId>>(
    reducer,
    initialState,
  );
  console.log(state);
  const runQuery = useCallback( (): void => {
    const [seachResponsePromise, abortSearch] = queryClient.queryStore(request);
    dispatch({type: 'searchStarted', request, abort: abortSearch})

    seachResponsePromise
      .then(searchResponse => {
        dispatch({type: 'searchCompleted', response: searchResponse, request})
      })
      .catch(error => {
        console.log(error, request);
        dispatch({type: 'searchFailed', request, error})
      })
  }, [request, queryClient]);

  useEffect(() => {
    queryClient.subscribeToStoreChange(request.storeId)(runQuery);

    return () => {
      queryClient.unsubscribeToStoreChange(request.storeId)(runQuery);
    };
  }, [request.storeId, queryClient, runQuery]);

  useEffect(() => {
    runQuery();
  }, [runQuery]);

  return state;
}
