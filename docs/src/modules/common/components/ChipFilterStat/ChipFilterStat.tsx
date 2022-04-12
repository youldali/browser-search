import React from 'react';
import { NextFilterStateStat } from 'browser-search';
import Chip from '@mui/material/Chip';
import LinearProgress from '@mui/material/LinearProgress';
import Fade from '@mui/material/Fade';
import PendingIcon from '@mui/icons-material/Pending';

type ChipFilterStatProps = {
  nextFilterStateStat?: NextFilterStateStat;
  isStale: boolean;

}

export const ChipFilterStat = ({
  nextFilterStateStat,
  isStale,
}: ChipFilterStatProps) => {
  if (!nextFilterStateStat) {
    return <LinearProgress />;
  }
  
  return (
    <>
    <Fade in={isStale} >
      <PendingIcon sx={{position: 'absolute', right: 0}} color='info' />
    </Fade>
    <Fade in={!isStale}>
    {
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
      }
    </Fade>
    </>
  );
}