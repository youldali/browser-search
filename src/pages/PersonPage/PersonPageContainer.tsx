import React, { useEffect } from 'react';

import { QuerySuspense } from '../../modules/common/components';
import { useCreatePersonStore } from '../../modules/person/hooks';

import { PersonPageSkeleton } from './PersonPageSkeleton';
import { PersonPage } from './PersonPage';
import { PersonPageError } from './PersonPageError';

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
      error={() => <PersonPageError />}
    />
  );
}
