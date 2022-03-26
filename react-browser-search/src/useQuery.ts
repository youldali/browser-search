import * as BS from 'browser-search';
import { Reducer, useCallback, useContext, useEffect, useReducer } from 'react';

import { BrowserSearchContext } from './provider';

export type SearchReponse<Document, TFilterId extends string = string> = Omit<BS.SearchResponse<Document, TFilterId>, '_cacheStatus_'>;

export type IdleState = {
  status: 'idle',
}

export type LoadingQueryState<Document, TFilterId extends string = string> = {
  status: 'loading',
  request: BS.Request<Document, TFilterId>;
  abort: BS.AbortSearch;
}

export type SuccessQueryState<Document, TFilterId extends string = string> = {
  status: 'success',
  request: BS.Request<Document, TFilterId>;
  response: SearchReponse<Document, TFilterId>;
}

export type ErrorQueryState<Document, TFilterId extends string = string> = {
  status: 'error',
  request: BS.Request<Document, TFilterId>;
  error: Error;
}


export type QueryState<Document, TFilterId extends string = string> = IdleState | LoadingQueryState<Document, TFilterId> | SuccessQueryState<Document, TFilterId> | ErrorQueryState<Document, TFilterId>;

type Action<Document, TFilterId extends string = string> =
  | { type: 'searchStarted'; request: BS.Request<Document, TFilterId>; abort: BS.AbortSearch}
  | { type: 'searchCompleted'; response: BS.SearchResponse<Document, TFilterId>; request: BS.Request<Document, TFilterId>;}
  | { type: 'searchFailed'; request: BS.Request<Document, TFilterId>; error: Error}
  
type QueryReducer<Document, TFilterId extends string = string> = Reducer<QueryState<Document, TFilterId>, Action<Document, TFilterId>>;

const initialState: IdleState = {
  status: 'idle',
};

const reducer = <Document, TFilterId extends string = string>(state: QueryState<Document, TFilterId>, action: Action<Document, TFilterId>): QueryState<Document, TFilterId> => {
  switch (action.type) {
    case 'searchStarted': {
      if(state.status === 'loading') {
        state.abort();
      }

      return {
        status: 'loading',
        request: action.request,
        abort: action.abort,
      } 
    }

    case 'searchCompleted': {
      return state.status === 'loading' && state.request === action.request ? 
      {
        status: 'success',
        request: action.request,
        response: action.response,
      } :
      state;
    }

    case 'searchFailed': {
      return state.status === 'loading' && state.request === action.request ? 
      {
        status: 'error',
        request: action.request,
        error: action.error
      } :
      state;
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

  const runQuery = useCallback( (): void => {
    const [seachResponsePromise, abortSearch] = queryClient.queryStore(request);
    dispatch({type: 'searchStarted', request, abort: abortSearch})

    seachResponsePromise
      .then(searchResponse => {
        dispatch({type: 'searchCompleted', response: searchResponse, request})
      })
      .catch(error => {
        console.log(error);
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