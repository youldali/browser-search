import React from 'react';
import Chip from '@mui/material/Chip';

import { uppercaseFirstLetter } from '../../../../utils';
import { PersonQueryResponse, usePersonTable } from '../../hooks';
import { ItemTable } from '../../../common';
import { Person } from '../../models';

type Props = {
  personQueryResponse: PersonQueryResponse
}

export const PersonTable = ({personQueryResponse}: Props) => {
  const personsTableProps = usePersonTable();

  return (
    <ItemTable 
      data={personQueryResponse.documents}
      dataCount={personQueryResponse.numberOfDocuments}
      {...personsTableProps}
      renderCell={(value, column) => {
        if(column === 'name') {
          return uppercaseFirstLetter(value as Person['name']);
        }
        if(column === 'hobbies') {
          return (value as Person['hobbies']).map((hobby) => <Chip key={hobby} sx={{marginRight: 1}} label={hobby} variant="outlined" />)
        }
        return null;
      }}
    />
  );
}
