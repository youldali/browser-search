import * as BS from 'browser-search';
import { useContext, useEffect, useReducer, Reducer } from 'react';
import { BrowserSearchContext } from './provider';


type State<T> = Omit<BS.SearchResponse<T>['payload'], '_cacheStatus_'> & {
  status: 'idle' | 'loading' | 'success' | 'error';
};

type Action<T> =
  | { type: 'startSearch'; }
  | { type: 'searchComplete'; searchResponse: BS.SearchResponse<T>; }
  | { type: 'searchFailed'; }
  
type SearchReducer<T> = Reducer<State<T>, Action<T>>;

const getInitialState = <T>(): State<T> => ({
  documents: [],
  stats: {},
  numberOfDocuments: 0,
  status: 'idle',
});

const reducer = <T>(state: State<T>, action: Action<T>): State<T> => {
  switch (action.type) {
    case 'startSearch': {
      return {
        ...state,
        status: 'loading',
      }
    }

    case 'searchComplete': {
      return {
        ...action.searchResponse.payload,
        status: 'success',
      }
    }

    case 'searchFailed': {
      return {
        ...getInitialState(),
        status: 'error',
      }
    }
 
    default:
      return state;
  }
}


export const useQuery = <T>(request: BS.Request<T>) => {
  const queryClient = useContext(BrowserSearchContext);
  const [state, dispatch] = useReducer<SearchReducer<T>>(
    reducer,
    getInitialState(),
  );

  useEffect(() => {
    queryClient.subscribeToStoreChange(request.storeId);
    return () => {
      queryClient.unsubscribeToStoreChange(request.storeId);
    };
  }, [request.storeId]);

  const runQuery = () =>
    queryClient
      .queryStore(request)
      .then(searchResponse => {
        dispatch({type: 'searchComplete', searchResponse})
      })
      .catch(e => {
        console.log(e);
        dispatch({type: 'searchFailed'})
      })

  

  return state;
}