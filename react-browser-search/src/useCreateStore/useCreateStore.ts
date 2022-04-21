import { SimplifiedIndexConfig, StoreId } from 'browser-search';
import { Reducer, useCallback, useContext, useReducer } from 'react';
import { Just, Maybe, Nothing } from 'purify-ts/Maybe';

import { buildStateMachine, StateTransition } from '../stateMachine';
import * as GenericQueryState from '../mutationQueryState';
import { BrowserSearchContext } from '../provider';

export type ResponsePayload = null;
export type RequestPayload<DataSchema> = {
  storeId: StoreId,
  indexConfig: SimplifiedIndexConfig<DataSchema>;
  keyPath: keyof DataSchema;
};


export interface IdleState extends GenericQueryState.MutationIdleState {
}

export interface LoadingQueryState<DataSchema> extends GenericQueryState.MutationLoadingQueryState<RequestPayload<DataSchema>>  {
}

export interface SuccessQueryState<DataSchema> extends GenericQueryState.MutationSuccessQueryState<RequestPayload<DataSchema>, ResponsePayload> {
}

export interface ErrorQueryState<DataSchema> extends GenericQueryState.MutationErrorQueryState<RequestPayload<DataSchema>, Error> {
}

export type QueryState<DataSchema> = IdleState | LoadingQueryState<DataSchema> | SuccessQueryState<DataSchema> | ErrorQueryState<DataSchema>;


const fromIdleToLoading = <DataSchema>(state: QueryState<DataSchema>, action: Action<DataSchema>): Maybe<LoadingQueryState<DataSchema>> => (
  state.status === 'idle' && action.type === 'requestStarted' ?
  Just({
    status: 'loading',
    request: action.request,
  }) : Nothing
)

const fromLoadingToError = <DataSchema>(state: QueryState<DataSchema>, action: Action<DataSchema>): Maybe<ErrorQueryState<DataSchema>> => (
  state.status === 'loading' && action.type === 'requestFailed' ?
  Just({
    status: 'error',
    request: action.request,
    error: action.error,
  }) : Nothing
)

const fromLoadingToSuccess = <DataSchema>(state: QueryState<DataSchema>, action: Action<DataSchema>): Maybe<SuccessQueryState<DataSchema>> => (
  state.status === 'loading' && action.type === 'requestCompleted' ?
  Just({
    status: 'success',
    request: action.request,
    response: action.response,
  }) : Nothing
)

export type RequestStartedAction<DataSchema> = { type: 'requestStarted'; request: RequestPayload<DataSchema>,};
export type RequestFailedAction<DataSchema> = { type: 'requestFailed'; request: RequestPayload<DataSchema>, error: Error}
export type RequestCompletedAction<DataSchema> = { type: 'requestCompleted'; response: ResponsePayload; request: RequestPayload<DataSchema>,}

export type Action<DataSchema> =
  | RequestStartedAction<DataSchema>
  | RequestFailedAction<DataSchema>
  | RequestCompletedAction<DataSchema>;
  
type QueryReducer<DataSchema> = Reducer<QueryState<DataSchema>, Action<DataSchema>>;

const initialState: IdleState = {
  status: 'idle',
};


export const buildReducer = <DataSchema>(): QueryReducer<DataSchema> => {
  const stateTransitions: StateTransition<QueryState<DataSchema>, Action<DataSchema>>[] = [fromIdleToLoading, fromLoadingToError, fromLoadingToSuccess];
  return buildStateMachine(stateTransitions);
}

export const useCreateStore = <DataSchema>(): [(request: RequestPayload<DataSchema>) => Promise<void>, QueryState<DataSchema>] => {
  const queryClient = useContext(BrowserSearchContext);
  const [state, dispatch] = useReducer<QueryReducer<DataSchema>>(
    buildReducer(),
    initialState,
  );

  const runQuery = useCallback( (request: RequestPayload<DataSchema>): Promise<void> => {
    const responsePromise = queryClient.createStore<DataSchema>(request.storeId)(request.indexConfig)(request.keyPath);
    
    dispatch({type: 'requestStarted', request})
    
    return (
      responsePromise
      .then(_ => {
        dispatch({type: 'requestCompleted', response: null, request})
        return;
      })
      .catch(error => {
        dispatch({type: 'requestFailed', request, error})
      })
    )
  }, [queryClient]);

  return [runQuery, state];
}