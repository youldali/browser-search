import React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

import { usePersonQuery, useUpdateFilterConfig } from '../../hooks';
import { QuerySuspense } from '../../../common';

import { PersonTableSkeleton } from './PersonTableSkeleton';
import { PersonTable } from './PersonTable';

export const PersonTableContainer = () => {
  const personQueryState = usePersonQuery();
  useUpdateFilterConfig();

  return (
    <section>
      <QuerySuspense
        queryState={personQueryState}
        error={() => <Alert severity="error">An error occured when displaying the data</Alert>}
        idle={() => (
          <PersonTableSkeleton />
        )}
        loading={() => (
          <PersonTableSkeleton />
        )}
        stale={({response}) => (
          <>
            <Box sx={{ width: '100%' }}>
              <LinearProgress />
            </Box>
            <PersonTable personQueryResponse={response} />
          </>
        )}
        success={
          ({response}) => <PersonTable personQueryResponse={response} />
        } 
      />
    </section>
  );
}
