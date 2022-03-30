import React from 'react';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';

export interface TableData {
  id: string;
}

export type HeadCell<T extends TableData> = {
  id: keyof T & string;
  numeric: boolean;
  label: string;
}

export type OrderDirection = 'asc' | 'desc';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
  headCell: {
    fontWeight: 600,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  }),
);

type ItemTableProps<T extends TableData> = {
  className?: string;
  headCells: HeadCell<T>[];
  orderDirection: OrderDirection;
  orderBy: string | undefined;
  perPage: number;
  page: number;
  dataCount: number;
  data: T[];
  onPageChange: (page: number) => void;
  onSortChange: (property: string) => void;
  onPerPageChange: (perPage: number) => void;
}

export const ItemTable = <T extends {id: string}>({
  className,
  headCells,
  orderDirection,
  orderBy,
  perPage,
  page,
  data,
  dataCount,
  onPageChange,
  onSortChange,
  onPerPageChange,
}: ItemTableProps<T>) => {
  const classes = useStyles();

  return (
    <section className={className}>
      <Paper className={classes.paper}>
        <TableContainer component={Paper}>
          <Table aria-label="simple table" size='small'>
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell
                    className={classes.headCell}
                    key={headCell.id}
                    align={headCell.numeric ? 'right' : 'left'}
                    sortDirection={orderBy === headCell.id ? orderDirection : false}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? orderDirection : 'asc'}
                      onClick={() => onSortChange(headCell.id)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
            {data.map((row) => (
              <TableRow key={row.id} className={classes.row}>
                {headCells.map((headCell) => {
                  const columnValue = row[headCell.id];
                  return (
                  <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? 'right' : 'left'}
                  >
                    {Array.isArray(columnValue) ? columnValue.join() : columnValue}
                  </TableCell>
                )})}
                
              </TableRow>
            ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={dataCount}
          rowsPerPage={perPage}
          page={page}
          onPageChange={(_, page) => onPageChange(page)}
          onRowsPerPageChange={(event) => onPerPageChange(parseInt(event.target.value, 10))}
        />
      </Paper>
    </section>
  );
}