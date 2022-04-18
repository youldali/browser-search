import React from 'react';
import Chip from '@mui/material/Chip';

import { uppercaseFirstLetter } from '../../../../utils';
import {
    useCreatePersonStore, usePersonQuery, usePersonTable, useUpdateFilterConfig,
} from '../../hooks';
import { ItemTable, QuerySuspense } from '../../../common';

export const PersonTable = () => {
  useCreatePersonStore();
  const personsTableProps = usePersonTable();
  const personQueryState = usePersonQuery();
  useUpdateFilterConfig();

  return (
    <section>
      <QuerySuspense
        queryState={personQueryState}
        error={() => <div>An error occured</div>}
        loading={() => <div>Loading</div>}
        stale={() => <div>Loading</div>}
        idle={() => <div>Loading</div>}
        success={
          ({response}) =>
          <ItemTable 
            data={response.documents}
            dataCount={response.numberOfDocuments}
            {...personsTableProps}
            renderCell={(value, column) => {
              if(column === 'name') {
                return uppercaseFirstLetter(value as string);
              }
              if(column === 'hobbies') {
                return (value as string[]).map((hobby) => <Chip sx={{marginRight: 1}} label={hobby} variant="outlined" />)
              }
              return null;
            }}
          />
        } 
      />
    </section>
  );
}
