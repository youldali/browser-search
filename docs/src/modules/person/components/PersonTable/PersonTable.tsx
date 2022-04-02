import React from 'react';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Button from '@mui/material/Button';
import { useMutateStore } from 'react-browser-search';

import { generatePersons, Person } from '../../models';
import {
    useCreatePersonStore, usePersonQuery, usePersonTable, useUpdateFilterConfig,
} from '../../hooks';
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
  useUpdateFilterConfig();

  const mutateStore = useMutateStore<Person>('Persons');

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
