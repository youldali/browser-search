import { useMemo, useState} from 'react';

import { Person } from '../../modules'
import { HeadCell, useItemTable } from '../ItemTable'
import { useQuery } from '../browserSearchHooks';
import { Request, FilterConfig, SearchResponse } from 'browser-search';

export const usePersonTable = () => {
  const [searchResponse, setSearchResponse] = useState<SearchResponse<Person>>();

  const itemTableProps = useItemTable({
    data: searchResponse?.documents ?? [],
    headCells,
  });

  const request: Request<Person> = useMemo(() => ({
    storeId,
    filterConfig,
    filtersApplied: ['lowAged'],
    orderBy: itemTableProps.orderBy,
    orderDirection: itemTableProps.orderDirection === 'desc' ? 'DESC' : 'ASC',
    page: itemTableProps.page,
    perPage: itemTableProps.perPage,
  }), [itemTableProps.orderBy, itemTableProps.orderDirection, itemTableProps.page, itemTableProps.perPage]);

  const queryState = useQuery<Person>(request)

  if(queryState.status === 'success' && queryState.response !== searchResponse) {
    setSearchResponse(queryState.response as any)
  }

  return {itemTableProps, searchResponse};
}

const headCells: HeadCell<Person>[] = [
  { id: 'name', numeric: false, label: 'Name' },
  { id: 'age', numeric: true, label: 'Age' },
  { id: 'country', numeric: false, label: 'Country' },
  { id: 'email', numeric: false, label: 'Email' },
  { id: 'profession', numeric: false, label: 'Profession' },
  { id: 'salary', numeric: true, label: 'Salary' },
  { id: 'favoriteColours', numeric: false, label: 'Favorite colours' },
];

const storeId = 'Persons';

const filterConfig: FilterConfig<Person> = [ 
  [ 
    { id: 'lowAged', field: 'age', operator: 'lt', operand: 30 }, // Filter
    { id: 'middleAged', field: 'age', operator: 'inRangeClosed', operand: [30, 50] }, // Filter
    { id: 'highAged', field: 'age', operator: 'gt', operand: 50 }, // Filter
  ],
  [
    { id: 'professionDentist', field: 'profession', operator: 'equals', operand: 'Dentist'}
  ]
];