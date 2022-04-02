import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Filter, FilterConfig, GroupOfFilters } from 'browser-search';

import { FilterId } from '../browserSearch/filterConfig';

import type { Person } from '../models';
import type { RootState } from '../../../redux';
type FilterGroupKey = string;
type PersonFilterConfig = FilterConfig<Person, FilterId>;

export const baseFilterConfig: PersonFilterConfig = [ 
  [ 
    { id: 'lowAged', field: 'age', operator: 'lt', operand: 30 },
    { id: 'middleAged', field: 'age', operator: 'inRangeClosed', operand: [30, 50] },
    { id: 'highAged', field: 'age', operator: 'gt', operand: 50 },
  ],
  [ 
    { id: 'lowSalary', field: 'salary', operator: 'lt', operand: 40000 },
    { id: 'middleSalary', field: 'salary', operator: 'inRangeClosed', operand: [40000, 70000] },
    { id: 'highSalary', field: 'salary', operator: 'gt', operand: 70000 },
  ],
  [
    { id: 'professionDentist', field: 'profession', operator: 'equals', operand: 'Dentist'}
  ]
];

type State = Record<FilterGroupKey, PersonFilterConfig>;

const initialState: State = {
  base: baseFilterConfig,
}

export const filterConfigSlice = createSlice({
  name: 'filterConfig',
  initialState,
  reducers: {
    replaceFilterConfig: (state, {payload}: PayloadAction<{
      key: string;
      value: PersonFilterConfig
    }>) => {
      state[payload.key] = payload.value;
    },
  },
})

const filterConfigRecordToFilterConfig = (filterConfigRecord: Record<string, PersonFilterConfig>) => Object.values(filterConfigRecord).reduce((acc: PersonFilterConfig, filterConfig: PersonFilterConfig): PersonFilterConfig => {
  acc.push(...filterConfig);
  return acc;
}, []);

const selectFilterConfigState = (state: RootState): State => state.filterConfig;

export const selectFilterConfig = createSelector(
  selectFilterConfigState,
  filterConfigRecordToFilterConfig,
)

export const filterConfigReducer = filterConfigSlice.reducer;

export const { replaceFilterConfig } = filterConfigSlice.actions;


