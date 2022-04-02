import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FiltersApplied } from 'browser-search';

import { FilterId } from '../browserSearch/filterConfig';

import type { RootState } from '../../../redux';

type FilterGroupKey = string;

interface FilterState {
  filterAppliedByGroup: Record<FilterGroupKey, FiltersApplied<FilterId>>;
  orderBy: FilterId | undefined;
  perPage: number;
  page: number;
  orderDirection: "asc" | "desc";
}

const initialState: FilterState = {
  filterAppliedByGroup: {},
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
        filterAppliedByGroup: {},
      }
    },

    switchFilter: ({filterAppliedByGroup}, {payload: {key, filter}}: PayloadAction<{key: FilterGroupKey, filter: FilterId}>) => {
      const filtersApplied = filterAppliedByGroup[key] ?? [];
      const filterIndex = filtersApplied.indexOf(filter);
      if(filterIndex > -1) {
        filtersApplied.splice(filterIndex, 1)
      }
      else {
        filtersApplied.push(filter);
      }
      filterAppliedByGroup[key] = filtersApplied;
    },

    replaceFiltersApplied: ({filterAppliedByGroup}, {payload: {key, filtersApplied}}: PayloadAction<{key: FilterGroupKey, filtersApplied: FiltersApplied}>) => {
      filterAppliedByGroup[key] = filtersApplied;
    },

    setPage(state, {payload}: PayloadAction<FilterState["page"]>) {
      if(payload >= 0) {
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
export const { resetFilters, switchFilter, setPage, setOrderDirection, setOrderBy, setPerPage, changeSort, replaceFiltersApplied } = filterSlice.actions;

const toFilterRecord = (filtersApplied: FiltersApplied<FilterId>) => filtersApplied.reduce((acc: Record<FilterId, boolean>, filter): Record<FilterId, boolean> => {
  acc[filter] = true;
  return acc
}, {} as Record<FilterId, boolean>);

const selectFiltersAppliedByGroup = (state: RootState): Record<FilterGroupKey, FiltersApplied<FilterId>> => state.filters.filterAppliedByGroup;

export const selectFiltersAppliedForGroup = (key: FilterGroupKey) => (state: RootState): FiltersApplied<FilterId> => selectFiltersAppliedByGroup(state)[key] ?? [];
export const selectFiltersAppliedRecordForGroup = (key: FilterGroupKey) => createSelector(selectFiltersAppliedForGroup(key), (filtersApplied) => toFilterRecord(filtersApplied));
export const selectFiltersApplied = createSelector(selectFiltersAppliedByGroup, (filterAppliedByGroup): FiltersApplied => Object.values(filterAppliedByGroup).flat());
export const selectFilterState = (state: RootState) => state.filters;

export const filterReducer = filterSlice.reducer;



