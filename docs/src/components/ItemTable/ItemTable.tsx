import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';

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
  onPageChange,
  onSortChange,
  onPerPageChange,
}: ItemTableProps<T>) => {
  const classes = useStyles();

  return (
    <section className={className}>
      <Paper className={classes.paper}>ß
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
                {headCells.map((headCell) => (
                  <TableCell
                    className={classes.headCell}
                    key={headCell.id}
                    align={headCell.numeric ? 'right' : 'left'}
                  >
                    {row[headCell.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={perPage}
          page={page}
          onChangePage={(_, page) => onPageChange(page)}
          onChangeRowsPerPage={(event) => onPerPageChange(parseInt(event.target.value, 10))}
        />
      </Paper>
    </section>
  );
}