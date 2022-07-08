import React from 'react';
import clsx from 'clsx';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

type Props = {
  className?: string;
}


export const Header = ({className}: Props) => {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
      <Typography variant="h6" noWrap>
          Browser-Search Demo
      </Typography>
      </Toolbar>
    </AppBar>
  );
}