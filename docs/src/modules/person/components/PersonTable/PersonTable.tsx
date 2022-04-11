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
          />
        } 
      />
    </section>
  );
}
