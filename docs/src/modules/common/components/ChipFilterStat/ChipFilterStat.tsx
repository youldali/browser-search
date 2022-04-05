import React from 'react';
import { NextFilterStateStat } from 'browser-search';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';

type ChipFilterStatProps = {
  nextFilterStateStat?: NextFilterStateStat;
}

export const ChipFilterStat = ({
  nextFilterStateStat
}: ChipFilterStatProps) => {
  if (!nextFilterStateStat) {
    return <CircularProgress size={20} />;
  }
  
  return (
    nextFilterStateStat.type === 'added' ?
      <Chip
        color="primary"
        size="small"
        label={`+ ${nextFilterStateStat.nextDocumentsAdded}`} 
      /> :
    nextFilterStateStat.type === 'narrowed' ?
      <Chip
        color="primary"
        size="small"
        label={nextFilterStateStat.nextNumberOfDocuments} 
      /> : 
      <Chip
        color="secondary"
        size="small"
        label={nextFilterStateStat.matchingNumberOfDocuments} 
      />
  );
}