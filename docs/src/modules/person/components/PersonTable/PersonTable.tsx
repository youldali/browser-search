import React from 'react';

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
        fallback={() => <div>An error occured</div>}
        loading={<div>Loading</div>}
      >
        {
          (queryResponse) =>
          <ItemTable 
            data={queryResponse.documents}
            dataCount={queryResponse.numberOfDocuments}
            {...personsTableProps}
          />
        } 
    </QuerySuspense>
    </section>
  );
}
