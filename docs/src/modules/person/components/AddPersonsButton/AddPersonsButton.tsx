import React from 'react';
import { useMutateStore } from 'react-browser-search';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import { SxProps } from '@mui/material/styles';

import { generatePersons, Person } from '../../models';
import { useCreatePersonStore, useUpdateFilterConfig } from '../../hooks';

type Props = {
  count: number
  sx?: SxProps;
}

export const AddPersonsButton = ({count, sx}: Props) => {
  useCreatePersonStore();
  useUpdateFilterConfig();

  const mutateStore = useMutateStore<Person>('Persons');

  const addData = () => {
    const persons  = generatePersons(count);
    mutateStore.addDataToStore(persons);
  }

  return (
    <Fab 
      size="medium"
      variant='extended'
      color="primary"
      onClick={addData}
      sx={sx}
    >
      <AddIcon sx={{ mr: 1 }} />
      Add {count} {count > 1 ? 'entries' : 'entry'}
    </Fab>
  );
}
