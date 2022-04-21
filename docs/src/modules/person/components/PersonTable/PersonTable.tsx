import React from 'react';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

import { uppercaseFirstLetter } from '../../../../utils';
import {
    PersonQueryResponse, usePersonQuery, usePersonTable, useUpdateFilterConfig,
} from '../../hooks';
import { ItemTable, ItemTableSkeleton, QuerySuspense } from '../../../common';
import { Person } from '../../models';

export const PersonTable = () => {
  const personsTableProps = usePersonTable();
  const personQueryState = usePersonQuery();
  useUpdateFilterConfig();

  const renderItemTable = (response: PersonQueryResponse) => (
    <ItemTable 
      data={response.documents}
      dataCount={response.numberOfDocuments}
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
  )

  return (
    <section>
      <QuerySuspense
        queryState={personQueryState}
        error={() => <Alert severity="error">An error occured when displaying the data</Alert>}
        idle={() => (
          <ItemTableSkeleton
            headCells={personsTableProps.headCells}
          />
        )}
        loading={() => (
          <ItemTableSkeleton
            headCells={personsTableProps.headCells}
          />
        )}
        stale={({response}) => (
          <>
            <Box sx={{ width: '100%' }}>
              <LinearProgress />
            </Box>
            {renderItemTable(response)}
          </>
        )}
        success={
          ({response}) => renderItemTable(response)
        } 
      />
    </section>
  );
}
