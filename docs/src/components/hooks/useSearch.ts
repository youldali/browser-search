import { useReducer, Reducer } from 'react';
import { searchStore, FilterConfig, RequestParams, SearchResponse } from 'browser-search';
import { Person } from '../../modules';

const filterConfig: FilterConfig<Person> = [ 
  [ 
    { id: 'lowAged', field: 'age', operator: 'lt', operand: 30 },
    { id: 'middleAged', field: 'age', operator: 'inRangeClosed', operand: [30, 50] },
    { id: 'highAged', field: 'age', operator: 'gt', operand: 50 },
  ],
  [
    { id: 'professionDentist', field: 'profession', operator: 'equals', operand: 'Dentist'}
  ]
];

const storeId = 'persons';

type State<T> = Omit<SearchResponse<T>['payload'], '_cacheStatus_'> & {
  status: 'idle' | 'loading' | 'success' | 'error';
};

type Action<T> =
  | { type: 'startSearch'; }
  | { type: 'searchComplete'; searchResponse: SearchResponse<T>; }
  | { type: 'searchFailed'; }
  
type SearchReducer<T> = Reducer<State<T>, Action<T>>;

const initialState: State<Person> = {
  documents: [],
  stats: {},
  numberOfDocuments: 0,
  status: 'idle',
};

const reducer: SearchReducer<Person> = (state, action) => {
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
        ...initialState,
        status: 'error',
      }
    }
 
    default:
      return state;
  }
}




export const useSearchPersonStore = () => {
  const searchStore_ = searchStore({
    filterConfig,
    storeId
  });

  const [data, dispatch] = useReducer(
    reducer,
    initialState,
  );

  const searchStore1 =(requestParams: RequestParams<Person>) => {
    const [result, abort] = searchStore_(requestParams)
      
    result.then(searchResponse => {
      dispatch({type: 'searchComplete', searchResponse})
    })
    .catch(e => {
      console.log(e);
      dispatch({type: 'searchFailed'})
    })
  }

  return 
} 
