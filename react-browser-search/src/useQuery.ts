import * as BS from 'browser-search';
import { Reducer, useCallback, useContext, useEffect, useReducer } from 'react';

import { BrowserSearchContext } from './provider';
import * as GenericQueryState from './queryState';
import { areRequestsEqual } from './request';

type RequestPayload<Document, TFilterId extends string> = BS.Request<Document, TFilterId>

type ResponsePayload<Document, TFilterId extends string> = SearchResponse<Document, TFilterId>;

export type SearchResponse<Document, TFilterId extends string = string> = Omit<BS.SearchResponse<Document, TFilterId>, '_cacheStatus_'>;

export interface IdleState extends GenericQueryState.IdleState {
}

export interface LoadingQueryState<Document, TFilterId extends string = string> extends GenericQueryState.LoadingQueryState<RequestPayload<Document, TFilterId>>  {
  abort: BS.AbortSearch;
}

export interface SuccessQueryState<Document, TFilterId extends string = string> extends GenericQueryState.SuccessQueryState<RequestPayload<Document, TFilterId>, ResponsePayload<Document, TFilterId>> {
}

export interface ErrorQueryState<Document, TFilterId extends string = string> extends GenericQueryState.ErrorQueryState<RequestPayload<Document, TFilterId>, Error> {
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
      if(state.status === 'loading' && !areRequestsEqual(state.request, action.request)) {
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
