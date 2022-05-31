import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import { Header } from '../../modules/common/components';
import { AddPersonsButton, FilterPanel, PersonTable } from '../../modules/person';

import { PersonPageDrawer } from './PersonPageDrawer';

export const PersonPage = () => (
  <Box sx={{ display: 'flex' }}>
    <CssBaseline />
    <Header />
    <PersonPageDrawer>
      <Toolbar />
      <FilterPanel />
    </PersonPageDrawer>
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <Toolbar />
      <AddPersonsButton count={1000} sx={{ mr: 2 }} />
      <AddPersonsButton count={1} />
      <Box sx={{ mt: 4 }}>
      <PersonTable />
      </Box>
    </Box>
  </Box>
)
