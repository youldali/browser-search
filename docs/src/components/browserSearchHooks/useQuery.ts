import * as BS from 'browser-search';
import { useCallback, useContext, useEffect, useReducer, Reducer } from 'react';
import { BrowserSearchContext } from './provider';


export type SearchReponse<T, TFilterId extends string = string> = Omit<BS.SearchResponse<T, TFilterId>, '_cacheStatus_'>;

export type IdleState = {
  status: 'idle',
}

export type LoadingQueryState<T, TFilterId extends string = string> = {
  status: 'loading',
  request: BS.Request<T, TFilterId>;
  abort: BS.AbortSearch;
}

export type SuccessQueryState<T, TFilterId extends string = string> = {
  status: 'success',
  request: BS.Request<T, TFilterId>;
  response: SearchReponse<T, TFilterId>;
}

export type ErrorQueryState<T, TFilterId extends string = string> = {
  status: 'error',
  request: BS.Request<T, TFilterId>;
}


export type QueryState<T, TFilterId extends string = string> = IdleState | LoadingQueryState<T, TFilterId> | SuccessQueryState<T, TFilterId> | ErrorQueryState<T, TFilterId>;

type Action<T, TFilterId extends string = string> =
  | { type: 'searchStarted'; request: BS.Request<T, TFilterId>; abort: BS.AbortSearch}
  | { type: 'searchCompleted'; response: BS.SearchResponse<T, TFilterId>; request: BS.Request<T, TFilterId>;}
  | { type: 'searchFailed'; request: BS.Request<T, TFilterId>;}
  
type QueryReducer<T, TFilterId extends string = string> = Reducer<QueryState<T, TFilterId>, Action<T, TFilterId>>;

const initialState: IdleState = {
  status: 'idle',
};

const reducer = <T, TFilterId extends string = string>(state: QueryState<T, TFilterId>, action: Action<T, TFilterId>): QueryState<T, TFilterId> => {
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
      } :
      state;
    }
 
    default:
      return state;
  }
}


export const useQuery = <T, TFilterId extends string = string>(request: BS.Request<T, TFilterId>): QueryState<T, TFilterId> => {
  const queryClient = useContext(BrowserSearchContext);
  const [state, dispatch] = useReducer<QueryReducer<T, TFilterId>>(
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
      .catch(e => {
        console.log(e);
        dispatch({type: 'searchFailed', request})
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
  }, [request]);

  return state;
}