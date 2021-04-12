import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { AppBar } from './AppBar';
import { ItemTable } from './ItemTable';
import { FilterPanel } from './FilterPanel';
import { personGenerator } from '../modules';
import { useItemTable } from './hooks';

console.log(personGenerator.generatePersons(10));

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
  const itemTableProps = useItemTable();
  return (
    <>
      <CssBaseline />
      <AppBar />
      <main className={classes.content}>
          <FilterPanel />
          <ItemTable 
            className={classes.itemTable} 
            {...itemTableProps}
          />
      </main>
    </>
  );
}

export default App;
