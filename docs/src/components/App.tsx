import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';

import { Header } from '../modules/common/components';
import { AddPersonsButton, FilterPanel, PersonTable } from '../modules/person/';

const drawerWidth = 300;

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
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            padding: 2,
          },
        }}
      >
        <Toolbar />
        <FilterPanel />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <AddPersonsButton />
        <Box sx={{ mt: 4 }}>
        <PersonTable />
        </Box>
      </Box>
    </Box>
  );
}
