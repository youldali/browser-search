import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { useIndexValues, useMutateStore } from 'react-browser-search';

import { generatePersons, Person } from '../../models';
import { useCreatePersonStore, usePersonQuery, usePersonTable } from '../../hooks';
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
  useCreatePersonStore();
  const personsTableProps = usePersonTable();
  const personQueryState = usePersonQuery();

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
