import React from 'react';
import Drawer from '@mui/material/Drawer';

const drawerWidth = 300;

type Props = {
  children: React.ReactNode
}

export const PersonPageDrawer = ({children}: Props) => (
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
    {children}
  </Drawer>
)
