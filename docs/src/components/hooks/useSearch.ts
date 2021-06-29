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

type State<T> = Omit<SearchResponse<T>['payload'], '_cacheStatus_'>

type Action<T> =
  | { type: 'startSearch'; }
  | { type: 'searchComplete'; searchResponse: SearchResponse<T>; }
  
type SearchReducer<T> = Reducer<State<T>, Action<T>>;

const reducer: SearchReducer<Person> = (state, action) => {
  switch (action.type) {
    case 'startSearch': {
    }
    case 'searchComplete': {

    }
 
    default:
      return state;
};

const initialState: State<Person> = {
  documents: [],
  stats: {},
  numberOfDocuments: 0,
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

  return (requestParams: RequestParams<Person>) => {
    searchStore_(requestParams)
      
  }
} 
