import React from 'react';
import { useSelector } from 'react-redux';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { generatePersons, Person } from '../../models';
import { selectFiltersApplied } from '../../redux';
import { useCreatePersonStore, usePersonQuery, usePersonTable } from '../../hooks';
import { useIndexValues, useMutateStore } from '../../../../browserSearchHooks';
import { ItemTable, QuerySuspense } from '../../../common';

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

export const PersonTable = () => {
  const classes = useStyles();
  const filtersApplied = useSelector(selectFiltersApplied);
  useCreatePersonStore();
  const personsTableProps = usePersonTable();
  const personQueryState = usePersonQuery({
    filtersApplied,
    orderBy: personsTableProps.orderBy,
    orderDirection: personsTableProps.orderDirection === 'desc' ? 'DESC' : 'ASC',
    page: personsTableProps.page,
    perPage: personsTableProps.perPage,
  });

  const mutateStore = useMutateStore<Person>('Persons');

  const indexValuesQueryState = useIndexValues<string>('Persons', 'country')

  console.log(indexValuesQueryState);

  const addData = () => {
    const persons  = generatePersons(1000);
    mutateStore.addDataToStore(persons);
  }

  return (
    <section>
      <div>
        <Button 
        variant="contained" 
        color="primary"
        onClick={addData}
        >
          Generate new persons
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
  );
}
