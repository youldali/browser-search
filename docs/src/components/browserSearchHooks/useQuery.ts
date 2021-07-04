import * as BS from 'browser-search';
import { useCallback, useContext, useEffect, useReducer, Reducer } from 'react';
import { BrowserSearchContext } from './provider';


type SearchReponseState<T> = Omit<BS.SearchResponse<T>, '_cacheStatus_'>;

type IdleState = {
  status: 'idle',
}

type LoadingState<T> = {
  status: 'loading',
  request: BS.Request<T>;
  abort: BS.AbortSearch;
}

type SuccessState<T> = {
  status: 'success',
  request: BS.Request<T>;
  response: SearchReponseState<T>;
}

type ErrorState<T> = {
  status: 'error',
  request: BS.Request<T>;
}


type State<T> = IdleState | LoadingState<T> | SuccessState<T> | ErrorState<T>;

type Action<T> =
  | { type: 'searchStarted'; request: BS.Request<T>; abort: BS.AbortSearch}
  | { type: 'searchCompleted'; response: BS.SearchResponse<T>; request: BS.Request<T>;}
  | { type: 'searchFailed'; request: BS.Request<T>;}
  
type SearchReducer<T> = Reducer<State<T>, Action<T>>;

const initialState: IdleState = {
  status: 'idle',
};

const reducer = <T>(state: State<T>, action: Action<T>): State<T> => {
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


export const useQuery = <T>(request: BS.Request<T>): State<T> => {
  const queryClient = useContext(BrowserSearchContext);
  const [state, dispatch] = useReducer<SearchReducer<T>>(
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