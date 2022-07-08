import React from 'react';

import { ItemTableSkeleton } from '../../../../common';
import { usePersonTable } from '../../../hooks';

export const PersonTableSkeleton = () => {
  const { headCells } = usePersonTable();

  return (
    <ItemTableSkeleton
      headCells={headCells}
    />
  )
}

