import React, { useEffect, useState } from 'react';
import * as BS from 'browser-search';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';

import { AppBar } from './AppBar';
import { ItemTable } from './ItemTable';
import { FilterPanel } from './FilterPanel';
import { QuerySuspense } from './QuerySuspense';

import { personGenerator, Person } from '../modules';
import { usePersonQuery, usePersonTable } from './hooks';
import { BrowserSearchProvider, useMutateStore } from './browserSearchHooks';

export type FilterId = 'lowAged' | 'middleAged' | 'highAged' | 'lowSalary' | 'middleSalary' | 'highSalary' | 'professionDentist';

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
  const [filtersApplied, setFiltersApplied] = useState<BS.FiltersApplied<FilterId>>([]);
  const personsTableProps = usePersonTable();
  const personQueryState = usePersonQuery<FilterId>({
    filtersApplied,
    orderBy: personsTableProps.orderBy,
    orderDirection: personsTableProps.orderDirection === 'desc' ? 'DESC' : 'ASC',
    page: personsTableProps.page,
    perPage: personsTableProps.perPage,
  });

  const mutateStore = useMutateStore<Person>('Persons');

  useEffect(() => {
    mutateStore.createStore({
      simple: ['name', 'age', 'salary', 'profession', 'country'],
      array: ['favoriteColours'],
    })('id');
  }, [])

  const addData = () => {
    const persons  = personGenerator.generatePersons(1000);
    mutateStore.addDataToStore(persons);
  }

  return (
    <BrowserSearchProvider>
      <CssBaseline />
      <AppBar />
      <main className={classes.content}>
          <FilterPanel 
            personQueryState={personQueryState}
            onFilterChange={(filtersApplied: BS.FiltersApplied<FilterId>) => setFiltersApplied(filtersApplied)}
            filtersApplied={filtersApplied}
          />
          
          <section>
            <div>
              <Button 
              variant="contained" 
              color="primary"
              onClick={addData}
              >
                Add data
              </Button>
            </div>
            <QuerySuspense
              queryState={personQueryState}
              fallback={() => <div>An error occured</div>}
              loading={<div>Loading</div>}
            >
              {
                (queryResponse) =>
                <ItemTable 
                  className={classes.itemTable} 
                  data={queryResponse.documents}
                  dataCount={queryResponse.numberOfDocuments}
                  {...personsTableProps}
                />
              } 
          </QuerySuspense>
          </section>
      </main>
    </BrowserSearchProvider>
  );
}
