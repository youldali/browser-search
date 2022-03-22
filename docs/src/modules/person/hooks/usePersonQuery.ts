import { useMemo } from 'react';
import { Request } from 'browser-search';

import { filterConfig, FilterId, storeId } from '../browserSearch';
import { Person } from '../models';
import { QueryState, useQuery } from '../../../browserSearchHooks';

type Props = Pick<Request<Person, FilterId>, 'filtersApplied' | 'orderBy' | 'orderDirection' | 'page' | 'perPage'>

export const usePersonQuery = (props: Props): QueryState<Person, FilterId> => {
  const request: Request<Person, FilterId> = useMemo(() => ({
    storeId,
    filterConfig,
    ...props,
  }), [props.orderBy, props.orderDirection, props.page, props.perPage, props.filtersApplied]);

  return useQuery<Person, FilterId>(request);
}
