import { FilterId } from '../browserSearch/filterConfig';

import { buildSearchSlice } from './redux-browser-search';

export const personStoreSearchSlice = buildSearchSlice<FilterId>({
  reducerName: 'search',
})
