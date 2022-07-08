import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Request } from '@browser-search/browser-search';
import {
    SuccessQueryState, useQuery, UseQueryQueryState, UseQuerySuccessState,
} from '@browser-search/react-browser-search';

import { personStoreFilterConfigSlice, personStoreSearchSlice } from '../redux';
import { FilterId, storeId } from '../browserSearch';
import { Person } from '../models';

const { selectors: searchSelectors } = personStoreSearchSlice;
const { selectors: configSelectors } = personStoreFilterConfigSlice;

export const usePersonQuery = (): UseQueryQueryState<Person, FilterId> => {
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

export type PersonQueryResponse = UseQuerySuccessState<Person, FilterId>["response"];
