import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { path as RPath } from 'ramda';

import { personStoreSearchSlice } from './searchSlice';

const {actions: searchSliceActions, selectors: searchSliceSelectors} = personStoreSearchSlice
const reducerPath = ['ui'];

export type State = {
  filters: {
    byNameText: string;
  }
};

const initialState: State = {
  filters: {
    byNameText: '',
  }
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setByNameFilterText: (state, {payload}: PayloadAction<string>) => {
      state.filters.byNameText = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(searchSliceActions.resetFilters.type, (state) => {
      state.filters.byNameText = '';
    })
  },
});

const slicePath = RPath(reducerPath);
const selectState = (state: object): State => slicePath(state) as State;
const selectByNameText = createSelector(
  selectState,
  (state) => state.filters.byNameText,
)

// when the name filter is on, we also have a filter on the lastName and firstName
const selectNumberOfFilters = createSelector(
  searchSliceSelectors.selectFiltersApplied,
  (filtersApplied) => filtersApplied.includes('name') ? filtersApplied.length - 2 : filtersApplied.length,
)

export const personUiStoreSlice = {
  reducer: uiSlice.reducer,
  actions: uiSlice.actions,
  selectors: {
    selectByNameText,
    selectNumberOfFilters,
  }
}
