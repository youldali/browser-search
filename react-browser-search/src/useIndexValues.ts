import { getAllValuesOfProperty, StoreId } from 'browser-search';
import { Reducer, useCallback, useContext, useEffect, useReducer } from 'react';

import * as GenericQueryState from './queryState';
import { BrowserSearchContext } from './provider';

type IndexId = string;

type RequestPayload = {
  indexId: IndexId;
  storeId: StoreId;
}

type ResponsePayload<T> = T[];

export interface IdleState extends GenericQueryState.IdleState {
}

export interface LoadingQueryState extends GenericQueryState.LoadingQueryState<RequestPayload>  {
}

export interface SuccessQueryState<T> extends GenericQueryState.SuccessQueryState<RequestPayload, ResponsePayload<T>> {
}

export interface ErrorQueryState extends GenericQueryState.ErrorQueryState<RequestPayload, Error> {
}

export type QueryState<T> = IdleState | LoadingQueryState | SuccessQueryState<T> | ErrorQueryState;

type Action<T> =
  | { type: 'requestStarted'; indexId: IndexId; storeId: StoreId;}
  | { type: 'requestCompleted'; response: T[]; indexId: IndexId; storeId: StoreId;}
  | { type: 'requestFailed'; indexId: IndexId; storeId: StoreId; error: Error}
  
type QueryReducer<T> = Reducer<QueryState<T>, Action<T>>;

const initialState: IdleState = {
  status: 'idle',
  isFetching: false,
};

const reducer = <T extends IDBValidKey>(state: QueryState<T>, action: Action<T>): QueryState<T> => {
  switch (action.type) {
    case 'requestStarted': {
      return {
        status: 'loading',
        request: {
          indexId: action.indexId,
          storeId: action.storeId,
        },
        isFetching: true,
      } 
    }

    case 'requestCompleted': {
      return state.status === 'loading' && state.request.indexId === action.indexId && state.request.storeId === action.storeId ? 
      {
        status: 'success',
        request: {
          indexId: action.indexId,
          storeId: action.storeId,
        },
        response: action.response,
        isFetching: false,
      } :
      state;
    }

    case 'requestFailed': {
      return state.status === 'loading' && state.request.indexId === action.indexId && state.request.storeId === action.storeId ? 
      {
        status: 'error',
        request: {
          indexId: action.indexId,
          storeId: action.storeId,
        },
        error: action.error,
        isFetching: false,
      } :
      state;
    }
 
    default:
      return state;
  }
}


export const useIndexValues = <T extends IDBValidKey>(storeId: StoreId, indexId: IndexId): QueryState<T> => {
  const queryClient = useContext(BrowserSearchContext);
  const [state, dispatch] = useReducer<QueryReducer<T>>(
    reducer,
    initialState,
  );

  const runQuery = useCallback( (): void => {
    const responsePromise = getAllValuesOfProperty(storeId)(indexId);
    dispatch({type: 'requestStarted', indexId, storeId})
    
    responsePromise
      .then(response => {
        dispatch({type: 'requestCompleted', response: response as T[], indexId, storeId})
      })
      .catch(error => {
        dispatch({type: 'requestFailed', indexId, storeId, error})
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