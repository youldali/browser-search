import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { AppBar } from './AppBar';
import { ItemTable } from './ItemTable';
import { FilterPanel } from './FilterPanel';
import { generatePersons } from './modules/dataGenerator';

console.log(generatePersons(10));

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

function App() {
  const classes = useStyles();
  return (
    <>
      <CssBaseline />
      <AppBar />
      <main className={classes.content}>
          <FilterPanel />
          <ItemTable className={classes.itemTable} />
      </main>
    </>
  );
}

export default App;
