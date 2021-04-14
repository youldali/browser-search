import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { AppBar } from './AppBar';
import { ItemTable } from './ItemTable';
import { FilterPanel } from './FilterPanel';
import { personGenerator } from '../modules';
import { usePersonTable } from './hooks';
import * as browserSearch from 'browser-search';



const filterConfig = [ 
    [ 
      { id: 'lowAged', field: 'age', operator: 'lt', operand: 30 }, // Filter
      { id: 'middleAged', field: 'age', operator: 'inRangeClosed', operand: [30, 50] }, // Filter
      { id: 'highAged', field: 'age', operator: 'gt', operand: 50 }, // Filter
    ],
  	[
      { id: 'professionDentist', field: 'profession', operator: 'equals', operand: 'Dentist'}
    ]
  ];

const initStore = async () => {
  const persons  = personGenerator.generatePersons(1000);
  await browserSearch.createStore('persons')({
    name: 'simple',
    age: 'simple',
    salary: 'simple',
    profession: 'simple',
    country: 'simple',
    favoriteColours: 'array'
  })('id');
  await browserSearch.addDataToStore('persons')(persons);
}
const search = async () => {
  try {
  const values = await browserSearch.getAllValuesOfProperty('persons')('favoriteColours');
  console.log(values);
  }
  catch(e){
    console.log('Error:', e);
  }

  try {
    const results = await browserSearch.processRequest({
      filterConfig,
      filtersApplied: ['lowAged'],
      orderBy: 'name',
      page: 1,
      storeId: 'persons',
    });
    console.log(results);
  }
  catch(e){
    console.log('Processing Error:', e);
  }
}
//initStore();
search();

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      display: 'flex',
    },
    itemTable: {
      flexGrow: 1,
    }
  }),
);

export const App = () => {
  const classes = useStyles();
  const personTableProps = usePersonTable({});
  return (
    <>
      <CssBaseline />
      <AppBar />
      <main className={classes.content}>
          <FilterPanel />
          <ItemTable 
            className={classes.itemTable} 
            {...personTableProps}
          />
      </main>
    </>
  );
}
