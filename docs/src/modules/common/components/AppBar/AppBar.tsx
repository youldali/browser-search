import React from 'react';
import clsx from 'clsx';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import AppBarMUI  from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

type AppBarProps = {
  className?: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
  }),
);


export const AppBar = ({className}: AppBarProps) => {
  const classes = useStyles();

    return (
      <AppBarMUI position="sticky" className={clsx(classes.appBar, className)}>
          <Toolbar>
          <Typography variant="h6" noWrap>
              Browser search demo
          </Typography>
          </Toolbar>
      </AppBarMUI>
    );
}