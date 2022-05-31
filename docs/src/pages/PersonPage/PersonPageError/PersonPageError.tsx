import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Skeleton from '@mui/material/Skeleton';
import Alert from '@mui/material/Alert';

import { Header } from '../../../modules/common/components';
import { FilterPanelSkeleton, PersonTableSkeleton } from '../../../modules/person';
import { PersonPageDrawer } from '../PersonPageDrawer';

export const PersonPageError = () => (
  <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <Header />
    <PersonPageDrawer>
      <Toolbar />
      <FilterPanelSkeleton />
    </PersonPageDrawer>
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">An error occured when creating the data store. It's likely that IndexedDB is not available in your browser.</Alert>
      </Box>
    </Box>
  </Box>
);
