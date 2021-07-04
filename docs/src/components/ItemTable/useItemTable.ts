import {useState} from 'react';
import { HeadCell, OrderDirection, TableData } from './ItemTable';

type UseItemTableProps<T extends TableData> = {
    defaultPerPage?: number;
    defaultPage?: number;
    defaultOrderBy?: string;
    defaultOrderDirection?: OrderDirection;
    data: T[];
    headCells: HeadCell<T>[];
}

const initialPerPage = 5;
const initialPage = 1;
const initialOrderBy = undefined;
const initialOrderDirection = 'asc';

export const useItemTable = <T extends TableData>({
  defaultPerPage = initialPerPage,
  defaultPage = initialPage,
  defaultOrderBy = initialOrderBy,
  defaultOrderDirection = initialOrderDirection,
  data,
  headCells,
}: UseItemTableProps<T>) => {
  const [orderDirection, setOrderDirection] = useState<OrderDirection>(defaultOrderDirection);
  const [orderBy, setOrderBy] = useState<string | undefined>(defaultOrderBy);
  const [perPage, setPerPage] = useState<number>(defaultPerPage);
  const [page, setPage] = useState<number>(defaultPage);

  const onSortChange = (property: string) => {
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return {
    orderDirection,
    onOrderDirectionChange: (orderDirection: 'asc' | 'desc') => setOrderDirection(orderDirection),
    orderBy,
    onOrderByChange: (orderBy: string) => setOrderBy(orderBy),
    perPage,
    onPerPageChange: (perPage: number) => setPerPage(perPage),
    page,
    onPageChange: (page: number) => setPage(page),
    onSortChange,
    data,
    headCells,
  }
}
