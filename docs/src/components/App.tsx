import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

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
        <FilterPanel
          personQueryState={personQueryState}
        />
        <PersonTable />
      </main>
    </>
  );
}
