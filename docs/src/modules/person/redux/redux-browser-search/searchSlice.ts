import {
    createSelector, createSlice, CreateSliceOptions, Draft, PayloadAction,
} from '@reduxjs/toolkit';
import { FiltersApplied } from '@browser-search/browser-search';
import { path as RPath } from 'ramda';

type FilterGroupKey = string;

export type SearchReducerState<FilterId extends string> = {
  filterAppliedByGroup: Record<FilterGroupKey, FiltersApplied<FilterId>>;
  orderBy: FilterId | undefined;
  perPage: number;
  page: number;
  orderDirection: "asc" | "desc";
};

const getDefaultInitialState = <FilterId extends string>(): SearchReducerState<FilterId> => ({
  filterAppliedByGroup: {},
  orderBy: undefined,
  perPage: 10,
  page: 0,
  orderDirection: 'asc',
});

export const buildSearchSlice = <FilterId extends string>({
    initialState = getDefaultInitialState<FilterId>(),
    reducerName,
    reducerPath = [reducerName],
    extraReducers
  }: {
  initialState?: SearchReducerState<FilterId>,
  reducerName: string,
  reducerPath?: string[],
  extraReducers?: CreateSliceOptions<SearchReducerState<FilterId>>['extraReducers']
}) => {

  const searchSlice = createSlice({
    name: reducerName,
    initialState,
    reducers: {
      reset: () => {
        return initialState;
      },
      
      resetFilters: (state) => {
        return {
          ...state,
          page: 0,
          filterAppliedByGroup: {},
        }
      },
  
      switchFilterForGroup: (state, {payload: {key, filter}}: PayloadAction<{key: FilterGroupKey, filter: FilterId}>) => {
        const filtersApplied = state.filterAppliedByGroup[key] ?? [];
        const filterIndex = filtersApplied.indexOf(filter as Draft<FilterId>);

        if(filterIndex > -1) {
          filtersApplied.splice(filterIndex, 1)
        }
        else {
          filtersApplied.push(filter as Draft<FilterId>);
        }
        state.filterAppliedByGroup[key] = filtersApplied;
        state.page = 0;
      },

      switchFiltersForGroups: (state, action: PayloadAction<Record<FilterGroupKey, FilterId>>) => {
        Object.entries(action.payload).map(([key, filter]) => searchSlice.caseReducers.switchFilterForGroup(state, {...action, payload: {key, filter}}))
      },
  
      replaceFiltersForGroup: (state, {payload: {key, filtersApplied}}: PayloadAction<{key: FilterGroupKey, filtersApplied: FiltersApplied<FilterId>}>) => {
        state.filterAppliedByGroup[key] = filtersApplied as Draft<FiltersApplied<FilterId>>;
        state.page = 0;
      },
  
      setPage(state, {payload}: PayloadAction<SearchReducerState<FilterId>["page"]>) {
        if(payload >= 0) {
          state.page = payload
        }
      },
  
      setOrderDirection(state, {payload}: PayloadAction<SearchReducerState<FilterId>["orderDirection"]>) {
        state.orderDirection = payload;
      },
  
      setOrderBy(state, {payload}: PayloadAction<SearchReducerState<FilterId>["orderBy"]>) {
        state.orderBy = payload as Draft<FilterId>;
      },
  
      setPerPage(state, {payload}: PayloadAction<SearchReducerState<FilterId>["perPage"]>) {
        if(payload > 0) {
          state.perPage = payload;
          state.page = 0;
        }
      },
  
      changeSort(state, {payload}: PayloadAction<{orderBy: SearchReducerState<FilterId>["orderBy"], orderDirection: SearchReducerState<FilterId>["orderDirection"]}>) {
        state.orderBy = payload.orderBy as Draft<FilterId>;
        state.orderDirection = payload.orderDirection;
      }
    },
    extraReducers,
  });

  const slicePath = RPath(reducerPath);
  const selectState = (state: object): SearchReducerState<FilterId> => slicePath(state) as SearchReducerState<FilterId>;

  const selectFiltersAppliedByGroup = createSelector(
    selectState,
    (state) => state.filterAppliedByGroup,
  )
  
  
  const selectFiltersAppliedForGroup = createSelector([
      selectFiltersAppliedByGroup,
      (_: object, key: FilterGroupKey) => key
    ],
    (filtersAppliedByGroup, key) => filtersAppliedByGroup[key] ?? []
  );
  
  const selectFiltersAppliedRecordForGroup = createSelector([
    selectFiltersAppliedByGroup,
    (_: object, key: FilterGroupKey) => key
  ],
  (filtersAppliedByGroup, key) => toFilterRecord(filtersAppliedByGroup[key] ?? [])
  )
  
  
  const selectFiltersApplied = createSelector(
    selectFiltersAppliedByGroup, 
    (filterAppliedByGroup): FiltersApplied => Object.values(filterAppliedByGroup).flat()
  );
  
  return {
    reducer: searchSlice.reducer,
    actions: searchSlice.actions,
    selectors: {
      selectSearchState: selectState,
      selectFiltersAppliedForGroup,
      selectFiltersAppliedRecordForGroup,
      selectFiltersApplied,
    }
  }
}

const toFilterRecord = <FilterId extends string>(filtersApplied: FiltersApplied<FilterId>) => filtersApplied.reduce((acc: Record<FilterId, boolean>, filter): Record<FilterId, boolean> => {
  acc[filter] = true;
  return acc
}, {} as Record<FilterId, boolean>);
