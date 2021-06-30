import React from 'react';
import { buildQueryClient } from './queryClient';

export const BrowserSearchContext = React.createContext(buildQueryClient());

export const BrowserSearchProvider = ({
  children,
}: {children: React.ReactNode}) => (
  <BrowserSearchContext.Provider value={buildQueryClient()}>
    {children}
  </BrowserSearchContext.Provider>
)