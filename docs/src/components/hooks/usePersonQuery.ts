import { useMemo } from 'react';
import { Request } from 'browser-search';

import { Person } from '../../modules'
import { useQuery, QueryState } from '../browserSearchHooks';
import { storeId, filterConfig } from '../../modules';

type Props = Pick<Request<Person>, 'filtersApplied' | 'orderBy' | 'orderDirection' | 'page' | 'perPage'>

export const usePersonQuery = (props: Props): QueryState<Person> => {
  const request: Request<Person> = useMemo(() => ({
    storeId,
    filterConfig,
    ...props,
  }), [props.orderBy, props.orderDirection, props.page, props.perPage, props.filtersApplied]);

  return useQuery<Person>(request);
}