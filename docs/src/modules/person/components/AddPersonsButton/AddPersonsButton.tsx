import React from 'react';
import { useMutateStore } from 'react-browser-search';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';

import { generatePersons, Person } from '../../models';
import { useCreatePersonStore, useUpdateFilterConfig } from '../../hooks';

export const AddPersonsButton = () => {
  useCreatePersonStore();
  useUpdateFilterConfig();

  const mutateStore = useMutateStore<Person>('Persons');

  const addData = () => {
    const persons  = generatePersons(1000);
    mutateStore.addDataToStore(persons);
  }

  return (
    <Fab 
      size="medium"
      variant='extended'
      color="primary"
      onClick={addData}
    >
      <AddIcon sx={{ mr: 1 }} />
      Generate new data
    </Fab>
  );
}
