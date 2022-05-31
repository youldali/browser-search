import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Skeleton from '@mui/material/Skeleton';

import { Header } from '../../../modules/common/components';
import { FilterPanelSkeleton, PersonTableSkeleton } from '../../../modules/person';
import { PersonPageDrawer } from '../PersonPageDrawer';

export const PersonPageSkeleton = () => (
  <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <Header />
    <PersonPageDrawer>
      <Toolbar />
      <FilterPanelSkeleton />
    </PersonPageDrawer>
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <Skeleton variant="text" height={30} width={100} sx={{ mr: 2 }} />
      <Skeleton variant="text" height={30} width={100} />

      <Box sx={{ mt: 4 }}>
        <PersonTableSkeleton />
      </Box>
    </Box>
  </Box>
);
