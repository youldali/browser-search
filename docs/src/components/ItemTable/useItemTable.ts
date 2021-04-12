import {useState} from 'react';
import { HeadCell, OrderDirection, TableData } from './ItemTable';

type UseItemTableProps<T extends TableData> = {
    perPage?: number;
    page?: number;
    orderBy?: string;
    orderDirection?: OrderDirection;
    data: T[];
    headCells: HeadCell<T>[];
}

export const useItemTable = <T extends TableData>({
  perPage: initialPerPage = 5,
  page: initialPage = 0,
  orderBy: initialOrderBy = undefined,
  orderDirection: initialOrderDirection = 'asc',
  data: initialData,
  headCells,
}: UseItemTableProps<T>) => {
  const [orderDirection, setOrderDirection] = useState<OrderDirection>(initialOrderDirection);
  const [orderBy, setOrderBy] = useState<string | undefined>(initialOrderBy);
  const [perPage, setPerPage] = useState<number>(initialPerPage);
  const [page, setPage] = useState<number>(initialPage);
  const [data, setData] = useState<T[]>(initialData);

  const onSortChange = (property: string) => {
    console.log(property);
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
    onDataChange: (data: T[]) => setData(data),
    data,
    headCells,
  }
}
