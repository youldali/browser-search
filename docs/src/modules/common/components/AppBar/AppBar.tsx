import React from 'react';
import clsx from 'clsx';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import AppBarMUI  from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

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