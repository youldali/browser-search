import React from 'react';
import Alert from '@mui/material/Alert';

export const FilterPanelError = () => {
  return (
    <Alert severity="error">An error occured when fetching the data.</Alert>
  );
}
