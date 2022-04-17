import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterConfig, GroupOfFilters } from 'browser-search';
import { path as RPath } from 'ramda';

type GroupId = string;

export type State<Document, FilterId extends string> = Record<GroupId, GroupOfFilters<Document, FilterId>>;

export const buildFilterConfigSlice = <Document, FilterId extends string>({
    initialState = {},
    reducerName,
    reducerPath = [reducerName],
  }: {
  initialState?: State<Document, FilterId>,
  reducerName: string,
  reducerPath?: string[],
}) => {

  const filterConfigSlice = createSlice({
    name: reducerName,
    initialState,
    reducers: {
      replaceFilterConfigs: (state, {payload}: PayloadAction<State<Document, FilterId>>) => {
        return {
          ...state,
          ...payload
        } as State<Document, FilterId>
      },
    },
  });

  const slicePath = RPath(reducerPath)
  const selectState = (state: object): State<Document, FilterId> => slicePath(state) as State<Document, FilterId>;
  const selectFilterConfig = createSelector(
    selectState,
    (state) => stateToFilterConfig(state),
  )

  return {
    reducer: filterConfigSlice.reducer,
    actions: filterConfigSlice.actions,
    selectors: {
      selectFilterConfig
    }
  }
}

const stateToFilterConfig = <Document, FilterId extends string>(state: State<Document, FilterId>) => (
    Object.values(state).reduce((acc: FilterConfig<Document, FilterId>, groupOfFilters: GroupOfFilters<Document, FilterId>): FilterConfig<Document, FilterId> => {
    acc.push(groupOfFilters);
    return acc;
  }, [])
)
