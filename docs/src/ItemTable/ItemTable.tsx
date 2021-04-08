import React, {useState} from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


const rows = [{
    "Name":"chevrolet chevelle malibu",
    "Miles_per_Gallon":18,
    "Cylinders":8,
    "Displacement":307,
    "Horsepower":130,
    "Weight_in_lbs":3504,
    "Acceleration":12,
    "Year":"1970-01-01",
    "Origin":"USA"
 },
 {
    "Name":"buick skylark 320",
    "Miles_per_Gallon":15,
    "Cylinders":8,
    "Displacement":350,
    "Horsepower":165,
    "Weight_in_lbs":3693,
    "Acceleration":11.5,
    "Year":"1970-01-01",
    "Origin":"USA"
 },
 {
  "Name":"BMW",
  "Miles_per_Gallon":15,
  "Cylinders":8,
  "Displacement":350,
  "Horsepower":165,
  "Weight_in_lbs":3693,
  "Acceleration":11.5,
  "Year":"1970-01-01",
  "Origin":"USA"
}

];

 const headCells = [
  { id: 'name', numeric: false, label: 'Dessert (100g serving)' },
  { id: 'calories', numeric: true, label: 'Calories' },
];


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
  headCell: {
    fontWeight: 600,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  }
  }),
);

export const ItemTable = () => {
  const classes = useStyles();
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string | undefined>(undefined);
  const sortHandler = (property: string) => {
    console.log(property);
    const isAsc = orderBy === property && orderDirection === 'asc';
    setOrderDirection(isAsc ? 'desc' : 'asc');
    setOrderBy(property)
  };

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
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
                  onClick={() => sortHandler(headCell.id)}
                >
                  {headCell.label}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
        {rows.map((row) => (
            <TableRow key={row.Name} className={classes.row}>
                <TableCell>
                    {row.Name}
                </TableCell>
                <TableCell align="right">{row.Horsepower}</TableCell>
            </TableRow>
        ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}