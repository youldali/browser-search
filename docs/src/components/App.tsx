import React, { useEffect } from 'react';
import * as browserSearch from 'browser-search';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';

import { AppBar } from './AppBar';
import { ItemTable } from './ItemTable';
import { FilterPanel } from './FilterPanel';

import { personGenerator, Person } from '../modules';
import { usePersonTable } from './hooks';
import { BrowserSearchProvider, useMutateStore } from './browserSearchHooks';


const initStore = async () => {
  const persons  = personGenerator.generatePersons(1000);
  await browserSearch.createStore<Person>('persons')({
    simple: ['name', 'age', 'salary', 'profession', 'country'],
    array: ['favoriteColours'],
  })('id');
  await browserSearch.addDocumentsToStore<Person>('persons')(persons);
}

const search = async () => {
  const values = await browserSearch.getAllValuesOfProperty('persons')('favoriteColours');
  console.log(values);
}

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
  const {itemTableProps, searchResponse} = usePersonTable();
  const mutateStore = useMutateStore<Person>('Persons');

  useEffect(() => {
    mutateStore.createStore({
      simple: ['name', 'age', 'salary', 'profession', 'country'],
      array: ['favoriteColours'],
    })('id');
    console.log('creation store');
  }, [])

  const addData = () => {
    console.log('adding data');
    const persons  = personGenerator.generatePersons(1000);
    mutateStore.addDataToStore(persons);
  }

  return (
    <BrowserSearchProvider>
      <CssBaseline />
      <AppBar />
      <main className={classes.content}>
          <FilterPanel />
          <Button 
            variant="contained" 
            color="primary"
            onClick={addData}
          >
            Add data
          </Button>
          <ItemTable 
            className={classes.itemTable} 
            dataCount={searchResponse?.numberOfDocuments ?? 0}
            {...itemTableProps}
          />
      </main>
    </BrowserSearchProvider>
  );
}
