import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Request } from 'browser-search';
import { QueryState, SuccessQueryState, useQuery } from 'react-browser-search';

import { personStoreFilterConfigSlice, personStoreSearchSlice } from '../redux';
import { FilterId, storeId } from '../browserSearch';
import { Person } from '../models';

const { selectors: searchSelectors } = personStoreSearchSlice;
const { selectors: configSelectors } = personStoreFilterConfigSlice;

export const usePersonQuery = (): QueryState<Person, FilterId> => {
  const searchState = useSelector(searchSelectors.selectSearchState);
  const filtersApplied = useSelector(searchSelectors.selectFiltersApplied);
  const filterConfig = useSelector(configSelectors.selectFilterConfig);

  const request: Request<Person, FilterId> = useMemo(() => ({
    storeId,
    filterConfig,
    filtersApplied,
    orderBy: searchState.orderBy,
    orderDirection: searchState.orderDirection === 'asc' ? 'ASC' : 'DESC',
    perPage: searchState.perPage,
    page: searchState.page,
  }), [searchState, filterConfig]);

  return useQuery<Person, FilterId>(request);
}

export type PersonQueryResponse = SuccessQueryState<Person, FilterId>["response"];
