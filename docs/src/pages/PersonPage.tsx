import React, { useEffect } from 'react';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';

import { Header, QuerySuspense } from '../modules/common/components';
import { AddPersonsButton, FilterPanel, PersonTable } from '../modules/person';
import { useCreatePersonStore } from '../modules/person/hooks';

const drawerWidth = 300;

export const PersonPage = () => {
  const [createPersonStore, createPersonStoreQueryState] = useCreatePersonStore();

  useEffect(() => {
    createPersonStore();
  }, [])
  return (
    <QuerySuspense 
      queryState={createPersonStoreQueryState}
      idle={() => <div>idle</div>}
      loading={() => <div>loading</div>}
      success={() => (
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
            <AddPersonsButton count={1000} sx={{ mr: 2 }} />
            <AddPersonsButton count={1} />
            <Box sx={{ mt: 4 }}>
            <PersonTable />
            </Box>
          </Box>
        </Box>
        )
      }
      error={() => <div>error</div>}
    />
  );
}
