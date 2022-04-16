import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

export const FilterPanelSkeleton = () => {
  return (
    <Stack spacing={3}>
      <Skeleton variant="rectangular" height={40} width={150} />
      <FilterListItemSkeleton />
      <FilterListItemSkeleton />
      <FilterAutocompleteSkeleton />
      <FilterAutocompleteSkeleton />
    </Stack>
  );
}

const FilterListItemSkeleton = () => (
  <Stack spacing={1}>
    <Skeleton variant="text" height={30} width={100} />
    <Skeleton variant="rectangular" height={140} />
  </Stack>
)

const FilterAutocompleteSkeleton = () => (
  <Stack spacing={1}>
    <Skeleton variant="text" height={30} width={100} />
    <Skeleton variant="rectangular" height={50} />
  </Stack>
)