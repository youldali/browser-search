import React, { useEffect } from 'react';
import Alert from '@mui/material/Alert';

import { QuerySuspense } from '../../modules/common/components';
import { useCreatePersonStore } from '../../modules/person/hooks';

import { PersonPageSkeleton } from './PersonPageSkeleton';
import { PersonPage } from './PersonPage';

export const PersonPageContainer = () => {
  const [createPersonStore, createPersonStoreQueryState] = useCreatePersonStore();

  useEffect(() => {
    createPersonStore();
  }, [])
  
  return (
    <QuerySuspense 
      queryState={createPersonStoreQueryState}
      idle={() => <PersonPageSkeleton />}
      loading={() => <PersonPageSkeleton />}
      success={() => <PersonPage />}
      error={() => <Alert severity="error">An error occured when creating the data store. It likely IndexedDB is not available in your browser.</Alert>}
    />
  );
}
