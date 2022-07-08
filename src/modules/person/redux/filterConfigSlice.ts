import { FilterId } from '../browserSearch/filterConfig';

import { buildFilterConfigSlice, State } from './redux-browser-search';
import { personStoreSearchSlice } from './searchSlice';

import type { Person } from '../models';
export const initialState: State<Person, FilterId> = {
  age: [ 
    { id: 'lowAged', field: 'age', operator: 'lt', operand: 30 },
    { id: 'middleAged', field: 'age', operator: 'inRangeClosed', operand: [30, 50] },
    { id: 'highAged', field: 'age', operator: 'gt', operand: 50 },
  ],
  salary: [ 
    { id: 'lowSalary', field: 'salary', operator: 'lt', operand: 40000 },
    { id: 'middleSalary', field: 'salary', operator: 'inRangeClosed', operand: [40000, 70000] },
    { id: 'highSalary', field: 'salary', operator: 'gt', operand: 70000 },
  ],
}

export const personStoreFilterConfigSlice = buildFilterConfigSlice({
  initialState,
  reducerName: 'filterConfig',
  extraReducers: (builder) => {
    builder.addCase(personStoreSearchSlice.actions.resetFilters.type, (state) => {
      // dynamic filter config depending on the filters set
      state['name'] = [];
    })
  }
})
