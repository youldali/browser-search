import React from 'react';
import { useAddDataToStore } from 'react-browser-search';
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import { SxProps } from '@mui/material/styles';

import { generatePersons, Person } from '../../models';
import { useUpdateFilterConfig } from '../../hooks';

type Props = {
  count: number
  sx?: SxProps;
}

export const AddPersonsButton = ({count, sx}: Props) => {
  useUpdateFilterConfig();

  const [addDataToStore] = useAddDataToStore<Person>();

  const addData = () => {
    const persons  = generatePersons(count);
    addDataToStore({storeId: 'Persons', data: persons});
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
