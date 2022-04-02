import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Request } from 'browser-search';
import { QueryState, useQuery } from 'react-browser-search';

import { selectFilterConfig, selectFiltersApplied, selectFilterState } from '../redux';
import { FilterId, storeId } from '../browserSearch';
import { Person } from '../models';

export const usePersonQuery = (): QueryState<Person, FilterId> => {
  const filterState = useSelector(selectFilterState);
  const filtersApplied = useSelector(selectFiltersApplied);
  const filterConfig = useSelector(selectFilterConfig);

  const request: Request<Person, FilterId> = useMemo(() => ({
    storeId,
    filterConfig,
    filtersApplied,
    orderBy: filterState.orderBy,
    orderDirection: filterState.orderDirection === 'asc' ? 'ASC' : 'DESC',
    perPage: filterState.perPage,
    page: filterState.page,
  }), [filterState]);

  return useQuery<Person, FilterId>(request);
}
