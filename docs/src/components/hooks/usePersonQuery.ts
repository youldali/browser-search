import { useMemo } from 'react';
import { Request } from 'browser-search';

import { Person } from '../../modules'
import { useQuery, QueryState } from '../browserSearchHooks';
import { storeId, FilterId, filterConfig } from '../../modules';

type Props = Pick<Request<Person, FilterId>, 'filtersApplied' | 'orderBy' | 'orderDirection' | 'page' | 'perPage'>

export const usePersonQuery = (props: Props): QueryState<Person, FilterId> => {
  const request: Request<Person, FilterId> = useMemo(() => ({
    storeId,
    filterConfig,
    ...props,
  }), [props.orderBy, props.orderDirection, props.page, props.perPage, props.filtersApplied]);

  return useQuery<Person, FilterId>(request);
}