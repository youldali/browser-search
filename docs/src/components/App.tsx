import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { AppBar } from './AppBar';
import { ItemTable } from './ItemTable';
import { FilterPanel } from './FilterPanel';
import { personGenerator, Person } from '../modules';
import { usePersonTable } from './hooks';
import * as browserSearch from 'browser-search';



const initStore = async () => {
  const persons  = personGenerator.generatePersons(1000);
  await browserSearch.createStore<Person>('persons')({
    simple: ['name', 'age', 'salary', 'profession', 'country'],
    array: ['favoriteColours'],
  })('id');
  await browserSearch.addDocumentsToStore<Person>('persons')(persons);
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
    const results = await browserSearch.searchStore<Person>({
      filterConfig,
      storeId: 'persons',
    })({
      filtersApplied: ['lowAged'],
      orderBy: 'name',
      page: 1
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
