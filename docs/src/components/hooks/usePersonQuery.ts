import { useMemo } from 'react';
import { Request } from 'browser-search';

import { Person } from '../../modules'
import { useQuery, QueryState } from '../browserSearchHooks';
import { storeId, filterConfig } from '../../modules';

type Props<TFilterId extends string> = Pick<Request<Person, TFilterId>, 'filtersApplied' | 'orderBy' | 'orderDirection' | 'page' | 'perPage'>

export const usePersonQuery = <TFilterId extends string>(props: Props<TFilterId>): QueryState<Person> => {
  const request: Request<Person, TFilterId> = useMemo(() => ({
    storeId,
    filterConfig,
    ...props,
  }), [props.orderBy, props.orderDirection, props.page, props.perPage, props.filtersApplied]);

  return useQuery<Person>(request);
}