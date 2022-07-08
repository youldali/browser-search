import React from 'react';
import { repeat, T } from 'ramda';
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
import Skeleton from '@mui/material/Skeleton';

import { HeadCell, TableData } from './ItemTable';

const rowsCount = 10;

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

type Props<T extends TableData> = {
  className?: string;
  headCells: HeadCell<T>[];
}

export const ItemTableSkeleton = <T extends {id: string}>({
  className,
  headCells,
}: Props<T>) => {
  const classes = useStyles();
  const data = repeat(null, rowsCount);

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
                  >
                    <TableSortLabel>
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} className={classes.row}>
                {headCells.map((headCell) => {
                  return (
                  <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? 'right' : 'left'}
                  >
                    <Skeleton variant='text' />
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
          count={0}
          rowsPerPage={rowsCount}
          page={0}
          onPageChange={T}
          onRowsPerPageChange={T}
        />
      </Paper>
    </section>
  );
}