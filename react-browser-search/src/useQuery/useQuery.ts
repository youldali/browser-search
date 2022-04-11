import * as BS from 'browser-search';
import { Reducer, useCallback, useContext, useEffect, useReducer } from 'react';
import { Just, Maybe, Nothing } from 'purify-ts/Maybe';

import { BrowserSearchContext } from '../provider';
import * as GenericQueryState from '../queryState';
import { areRequestsEqual } from '../request';
import { buildStateMachine, StateTransition } from '../stateMachine';

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


const fromIdleToLoading = <Document, TFilterId extends string = string>(state: QueryState<Document, TFilterId>, action: Action<Document, TFilterId>): Maybe<LoadingQueryState<Document, TFilterId>> => (
  state.status === 'idle' && action.type === 'searchStarted' ?
  Just({
    status: 'loading',
    request: action.request,
    abort: action.abort,
    isFetching: true,
  }) : Nothing
)

const fromLoadingToLoading = <Document, TFilterId extends string = string>(state: QueryState<Document, TFilterId>, action: Action<Document, TFilterId>): Maybe<LoadingQueryState<Document, TFilterId>> => {
  if(state.status === 'loading' && action.type === 'searchStarted') {
    if(!areRequestsEqual(state.request, action.request)) {
      state.abort();
    }

    return Just({
      status: 'loading',
      request: action.request,
      abort: action.abort,
      isFetching: true,
    })
  }

  return Nothing;
}

const fromLoadingToError = <Document, TFilterId extends string = string>(state: QueryState<Document, TFilterId>, action: Action<Document, TFilterId>): Maybe<ErrorQueryState<Document, TFilterId>> => (
  state.status === 'loading' && action.type === 'searchFailed' && state.request === action.request ?
  Just({
    status: 'error',
    request: action.request,
    error: action.error,
    isFetching: false,
  }) : Nothing
)


const fromLoadingToSuccess = <Document, TFilterId extends string = string>(state: QueryState<Document, TFilterId>, action: Action<Document, TFilterId>): Maybe<SuccessQueryState<Document, TFilterId>> => (
  state.status === 'loading' && action.type === 'searchCompleted' && state.request === action.request ?
  Just({
    status: 'success',
    request: action.request,
    response: action.response,
    isFetching: false,
  }) : Nothing
)

const fromSuccessToStale = <Document, TFilterId extends string = string>(state: QueryState<Document, TFilterId>, action: Action<Document, TFilterId>): Maybe<StaleQueryState<Document, TFilterId>> => (
  state.status === 'success' && action.type === 'searchStarted' ?
  Just({
    status: 'stale',
    request: state.request,
    response: state.response,
    newRequest: action.request,
    abort: action.abort,
    isFetching: true,
  }) : Nothing
)

const fromStaleToSuccess = <Document, TFilterId extends string = string>(state: QueryState<Document, TFilterId>, action: Action<Document, TFilterId>): Maybe<SuccessQueryState<Document, TFilterId>> => (
  state.status === 'stale' && action.type === 'searchCompleted' && state.newRequest === action.request ?
  Just({
    status: 'success',
    request: action.request,
    response: action.response,
    isFetching: false,
  }) : Nothing
)

const fromStaleToStale = <Document, TFilterId extends string = string>(state: QueryState<Document, TFilterId>, action: Action<Document, TFilterId>): Maybe<StaleQueryState<Document, TFilterId>> => {
  if(state.status === 'stale' && action.type === 'searchStarted'){
    if(state.status === 'stale' && !areRequestsEqual(state.newRequest, action.request)) {
      state.abort();
    }

    return Just({
      status: 'stale',
      request: state.request,
      response: state.response,
      newRequest: action.request,
      abort: action.abort,
      isFetching: true,
    })
  }

  return Nothing;
}

const fromStaleToError = <Document, TFilterId extends string = string>(state: QueryState<Document, TFilterId>, action: Action<Document, TFilterId>): Maybe<ErrorQueryState<Document, TFilterId>> => (
  state.status === 'stale' && action.type === 'searchFailed' && state.newRequest === action.request ?
  Just({
    status: 'error',
    request: action.request,
    error: action.error,
    isFetching: false,
  }) : Nothing
)

const fromErrorToLoading = <Document, TFilterId extends string = string>(state: QueryState<Document, TFilterId>, action: Action<Document, TFilterId>): Maybe<LoadingQueryState<Document, TFilterId>> => (
  state.status === 'error' && action.type === 'searchStarted' ?
  Just({
    status: 'loading',
    request: action.request,
    abort: action.abort,
    isFetching: true,
  }) : Nothing
)

//----

// type StateTransition = <Document, TFilterId extends string = string>(state: QueryState<Document, TFilterId>, action: Action<Document, TFilterId>) => Maybe<QueryState<Document, TFilterId>>;
// export const reducer = <Document, TFilterId extends string = string>(state: QueryState<Document, TFilterId>, action: Action<Document, TFilterId>): QueryState<Document, TFilterId> => {
//   const stateTransitions: StateTransition[] = [fromIdleToLoading, fromLoadingToLoading, fromLoadingToError, fromLoadingToSuccess, fromSuccessToStale, fromStaleToStale, fromStaleToSuccess, fromStaleToError, fromErrorToLoading]
//   const maybeNextState = stateTransitions.reduce(
//     (maybeNextState: Maybe<QueryState<Document, TFilterId>>, stateTransition: StateTransition): Maybe<QueryState<Document, TFilterId>> => 
//       maybeNextState.alt(stateTransition(state, action))
//   , Nothing);

//   return maybeNextState.caseOf({
//     Just: (nextState) => nextState,
//     Nothing: () => state,
//   })
// }


export const buildReducer = <Document, TFilterId extends string = string>(): QueryReducer<Document, TFilterId> => {
  const stateTransitions: StateTransition<QueryState<Document, TFilterId>, Action<Document, TFilterId>>[] = [fromIdleToLoading, fromLoadingToLoading, fromLoadingToError, fromLoadingToSuccess, fromSuccessToStale, fromStaleToStale, fromStaleToSuccess, fromStaleToError, fromErrorToLoading]
  return buildStateMachine(stateTransitions);
}

export const useQuery = <Document, TFilterId extends string = string>(request: BS.Request<Document, TFilterId>): QueryState<Document, TFilterId> => {
  const queryClient = useContext(BrowserSearchContext);
  const [state, dispatch] = useReducer<QueryReducer<Document, TFilterId>>(
    buildReducer<Document, TFilterId>(),
    initialState,
  );

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
