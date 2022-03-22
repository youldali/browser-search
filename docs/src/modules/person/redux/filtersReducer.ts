import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FiltersApplied } from 'browser-search';

import { FilterId } from '../browserSearch/filterConfig';

import type { RootState } from '../../../redux';

interface FilterState {
  filterApplied: FiltersApplied<FilterId>;
  orderBy: FilterId | undefined;
  perPage: number;
  page: number;
  orderDirection: "asc" | "desc";
}

const initialState: FilterState = {
  filterApplied: [],
  orderBy: undefined,
  perPage: 10,
  page: 1,
  orderDirection: 'asc',
}

export const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    resetFilters: (state) => {
      return {
        ...state,
        filterApplied: [],
      }
    },

    switchFilter: ({filterApplied}, action: PayloadAction<FilterId>) => {
      const filterIndex = filterApplied.indexOf(action.payload);
      if(filterIndex > -1) {
        filterApplied.splice(filterIndex, 1)
      }
      else {
        filterApplied.push(action.payload);
      }
    },

    setPage(state, {payload}: PayloadAction<FilterState["page"]>) {
      if(payload > 0) {
        state.page = payload
      }
    },

    setOrderDirection(state, {payload}: PayloadAction<FilterState["orderDirection"]>) {
      state.orderDirection = payload;
    },

    setOrderBy(state, {payload}: PayloadAction<FilterState["orderBy"]>) {
      state.orderBy = payload;
    },

    setPerPage(state, {payload}: PayloadAction<FilterState["perPage"]>) {
      if(payload > 0) {
        state.perPage = payload
      }
    },

    changeSort(state, {payload}: PayloadAction<{orderBy: FilterState["orderBy"], orderDirection: FilterState["orderDirection"]}>) {
      state.orderBy = payload.orderBy;
      state.orderDirection = payload.orderDirection;
    }
  },
})

export const { resetFilters, switchFilter, setPage, setOrderDirection, setOrderBy, setPerPage, changeSort } = filterSlice.actions;

export const selectFiltersApplied = (state: RootState) => state.filters.filterApplied;
export const selectFiltersAppliedAsRecord = (state: RootState) => toFilterRecord(state.filters.filterApplied);
export const selectFilterState = (state: RootState) => state.filters;

export const filterReducer = filterSlice.reducer;


const toFilterRecord = (filtersApplied: FiltersApplied<FilterId>) => filtersApplied.reduce((acc: Record<FilterId, boolean>, filter): Record<FilterId, boolean> => {
  acc[filter] = true;
  return acc
}, {} as Record<FilterId, boolean>);
