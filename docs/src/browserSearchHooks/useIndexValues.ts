import * as BS from 'browser-search';
import { StoreId } from 'browser-search';
import { useCallback, useContext, useEffect, useReducer, Reducer } from 'react';
import { BrowserSearchContext } from './provider';

type IndexId = string;

export type IdleState = {
  status: 'idle',
}

export type LoadingQueryState = {
  status: 'loading',
  indexId: IndexId;
  storeId: StoreId;
}

export type SuccessQueryState<T> = {
  status: 'success',
  indexId: IndexId;
  storeId: StoreId;
  response: T[];
}

export type ErrorQueryState = {
  status: 'error',
  indexId: IndexId;
  storeId: StoreId;
}


export type QueryState<T> = IdleState | LoadingQueryState | SuccessQueryState<T> | ErrorQueryState;

type Action<T> =
  | { type: 'requestStarted'; indexId: IndexId; storeId: StoreId;}
  | { type: 'requestCompleted'; response: T[]; indexId: IndexId; storeId: StoreId;}
  | { type: 'requestFailed'; indexId: IndexId; storeId: StoreId;}
  
type QueryReducer<T> = Reducer<QueryState<T>, Action<T>>;

const initialState: IdleState = {
  status: 'idle',
};

const reducer = <T extends IDBValidKey>(state: QueryState<T>, action: Action<T>): QueryState<T> => {
  switch (action.type) {
    case 'requestStarted': {
      return {
        status: 'loading',
        indexId: action.indexId,
        storeId: action.storeId,
      } 
    }

    case 'requestCompleted': {
      return state.status === 'loading' && state.indexId === action.indexId && state.storeId === action.storeId ? 
      {
        status: 'success',
        indexId: action.indexId,
        response: action.response,
        storeId: action.storeId,
      } :
      state;
    }

    case 'requestFailed': {
      return state.status === 'loading' && state.indexId === action.indexId && state.storeId === action.storeId ? 
      {
        status: 'error',
        indexId: action.indexId,
        storeId: action.storeId,
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
    const responsePromise = BS.getAllValuesOfProperty(storeId)(indexId);
    dispatch({type: 'requestStarted', indexId, storeId})

    responsePromise
      .then(response => {
        dispatch({type: 'requestCompleted', response: response as T[], indexId, storeId})
      })
      .catch(e => {
        console.log(e);
        dispatch({type: 'requestFailed', indexId, storeId})
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