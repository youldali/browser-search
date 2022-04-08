import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import CssBaseline from '@mui/material/CssBaseline';

import { Header } from '../modules/common/components';
import { FilterPanel, PersonTable } from '../modules/person/';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      display: 'flex',
    },
    itemTable: {
      flexGrow: 1,
    }
  }),
);

export const App = () => {
  const classes = useStyles();

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Header />
      <FilterPanel />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <PersonTable />
      </Box>
    </Box>
  );
}
