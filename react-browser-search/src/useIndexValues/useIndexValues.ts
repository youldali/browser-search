import { getAllValuesOfProperty, StoreId } from 'browser-search';
import { Reducer, useCallback, useContext, useEffect, useReducer } from 'react';
import { Just, Maybe, Nothing } from 'purify-ts/Maybe';

import { buildStateMachine, StateTransition } from '../stateMachine';
import * as GenericQueryState from '../queryState';
import { BrowserSearchContext } from '../provider';

type IndexId = string;

export type RequestPayload = {
  indexId: IndexId;
  storeId: StoreId;
}

export type ResponsePayload<FieldValues> = FieldValues[];

export interface IdleState extends GenericQueryState.IdleState {
}

export interface LoadingQueryState extends GenericQueryState.LoadingQueryState<RequestPayload>  {
}

export interface StaleQueryState<T> extends GenericQueryState.StaleQueryState<RequestPayload, ResponsePayload<T>> {
}

export interface SuccessQueryState<T> extends GenericQueryState.SuccessQueryState<RequestPayload, ResponsePayload<T>> {
}

export interface ErrorQueryState extends GenericQueryState.ErrorQueryState<RequestPayload, Error> {
}

export type QueryState<T> = IdleState | LoadingQueryState | StaleQueryState<T> | SuccessQueryState<T> | ErrorQueryState;

export type RequestStartedAction = { type: 'requestStarted'; request: RequestPayload,};
export type RequestFailedAction = { type: 'requestFailed'; request: RequestPayload, error: Error}
export type RequestCompletedAction<FieldValues> = { type: 'requestCompleted'; response: FieldValues[]; request: RequestPayload,}

export type Action<FieldValues> =
  | RequestStartedAction
  | RequestFailedAction
  | RequestCompletedAction<FieldValues>;
  
type QueryReducer<T> = Reducer<QueryState<T>, Action<T>>;

const initialState: IdleState = {
  status: 'idle',
  isFetching: false,
};

const fromIdleToLoading = <FieldValues>(state: QueryState<FieldValues>, action: Action<FieldValues>): Maybe<LoadingQueryState> => (
  state.status === 'idle' && action.type === 'requestStarted' ?
  Just({
    status: 'loading',
    request: action.request,
    isFetching: true,
  }) : Nothing
)

const fromLoadingToLoading = <FieldValues>(state: QueryState<FieldValues>, action: Action<FieldValues>): Maybe<LoadingQueryState> => (
  state.status === 'loading' && action.type === 'requestStarted' ?
  Just({
    status: 'loading',
    request: action.request,
    isFetching: true,
  }) : Nothing
)

const fromLoadingToError = <FieldValues>(state: QueryState<FieldValues>, action: Action<FieldValues>): Maybe<ErrorQueryState> => (
  state.status === 'loading' && action.type === 'requestFailed' && state.request === action.request ?
  Just({
    status: 'error',
    request: action.request,
    error: action.error,
    isFetching: false,
  }) : Nothing
)

const fromLoadingToSuccess = <FieldValues>(state: QueryState<FieldValues>, action: Action<FieldValues>): Maybe<SuccessQueryState<FieldValues>> => (
  state.status === 'loading' && action.type === 'requestCompleted' && state.request === action.request ?
  Just({
    status: 'success',
    request: action.request,
    response: action.response,
    isFetching: false,
  }) : Nothing
)

const fromSuccessToStale = <FieldValues>(state: QueryState<FieldValues>, action: Action<FieldValues>): Maybe<StaleQueryState<FieldValues>> => (
  state.status === 'success' && action.type === 'requestStarted' ?
  Just({
    status: 'stale',
    request: state.request,
    response: state.response,
    newRequest: action.request,
    isFetching: true,
  }) : Nothing
)

const fromStaleToSuccess = <FieldValues>(state: QueryState<FieldValues>, action: Action<FieldValues>): Maybe<SuccessQueryState<FieldValues>> => (
  state.status === 'stale' && action.type === 'requestCompleted' && state.newRequest === action.request ?
  Just({
    status: 'success',
    request: action.request,
    response: action.response,
    isFetching: false,
  }) : Nothing
)

const fromStaleToStale = <FieldValues>(state: QueryState<FieldValues>, action: Action<FieldValues>): Maybe<StaleQueryState<FieldValues>> => (
  state.status === 'stale' && action.type === 'requestStarted' ?
    Just({
      status: 'stale',
      request: state.request,
      response: state.response,
      newRequest: action.request,
      isFetching: true,
    }) :
   Nothing
)

const fromStaleToError = <FieldValues>(state: QueryState<FieldValues>, action: Action<FieldValues>): Maybe<ErrorQueryState> => (
  state.status === 'stale' && action.type === 'requestFailed' && state.newRequest === action.request ?
  Just({
    status: 'error',
    request: action.request,
    error: action.error,
    isFetching: false,
  }) : Nothing
)

const fromErrorToLoading = <FieldValues>(state: QueryState<FieldValues>, action: Action<FieldValues>): Maybe<LoadingQueryState> => (
  state.status === 'error' && action.type === 'requestStarted' ?
  Just({
    status: 'loading',
    request: action.request,
    isFetching: true,
  }) : Nothing
)

export const buildReducer = <FieldValues>(): QueryReducer<FieldValues> => {
  const stateTransitions: StateTransition<QueryState<FieldValues>, Action<FieldValues>>[] = [fromIdleToLoading, fromLoadingToLoading, fromLoadingToError, fromLoadingToSuccess, fromSuccessToStale, fromStaleToStale, fromStaleToSuccess, fromStaleToError, fromErrorToLoading];
  return buildStateMachine(stateTransitions);
}

export const useIndexValues = <T extends IDBValidKey>(storeId: StoreId, indexId: IndexId): QueryState<T> => {
  const queryClient = useContext(BrowserSearchContext);
  const [state, dispatch] = useReducer<QueryReducer<T>>(
    buildReducer<T>(),
    initialState,
  );

  const runQuery = useCallback( (): void => {
    const responsePromise = getAllValuesOfProperty(storeId)(indexId);
    const request = {
      storeId,
      indexId,
    };
    dispatch({type: 'requestStarted', request})
    
    responsePromise
      .then(response => {
        dispatch({type: 'requestCompleted', response: response as T[], request})
      })
      .catch(error => {
        dispatch({type: 'requestFailed', request, error})
      })
  }, [storeId, indexId]);

  useEffect(() => {
    queryClient.subscribeToStoreChange(storeId)(runQuery);

    return () => {
      queryClient.unsubscribeToStoreChange(storeId)(runQuery);
    };
  }, [storeId, queryClient, runQuery]);

  useEffect(() => {
    runQuery();
  }, [runQuery]);

  return state;
}