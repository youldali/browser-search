import { useDispatch, useSelector } from 'react-redux';

import {
    changeSort, selectFilterState, setOrderBy, setOrderDirection, setPage, setPerPage,
} from '../redux';
import { Person } from '../models';
import { FilterId } from '../browserSearch';
import { AppDispatch } from '../../../redux';
import { HeadCell } from '../../common';

const headCells: HeadCell<Person>[] = [
  { id: 'name', numeric: false, label: 'Name' },
  { id: 'age', numeric: true, label: 'Age' },
  { id: 'country', numeric: false, label: 'Country' },
  { id: 'email', numeric: false, label: 'Email' },
  { id: 'profession', numeric: false, label: 'Profession' },
  { id: 'salary', numeric: true, label: 'Salary' },
  { id: 'favoriteColours', numeric: false, label: 'Favorite colours' },
];

export const usePersonTable = () => {
  const filterState = useSelector(selectFilterState);
  const dispatch: AppDispatch = useDispatch();

  const {orderDirection, orderBy, page, perPage} = filterState;

  const onSortChange = (property: string) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    dispatch(changeSort({
      orderBy: property as FilterId,
      orderDirection: isAsc ? 'desc' : 'asc'
    }));
  };

  return {
    orderDirection,
    onOrderDirectionChange: (orderDirection: 'asc' | 'desc') => dispatch(setOrderDirection(orderDirection)),
    orderBy,
    onOrderByChange: (orderBy: string) => dispatch(setOrderBy(orderBy as FilterId)),
    perPage,
    onPerPageChange: (perPage: number) => dispatch(setPerPage(perPage)),
    page,
    onPageChange: (page: number) => dispatch(setPage(page)),
    onSortChange,
    headCells,
  }
}
