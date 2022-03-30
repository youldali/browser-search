import React from 'react';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import CssBaseline from '@mui/material/CssBaseline';

import { AppBar } from '../modules/common/components/AppBar';
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
    <>
      <CssBaseline />
      <AppBar />
      <main className={classes.content}>
        <FilterPanel />
        <PersonTable />
      </main>
    </>
  );
}
