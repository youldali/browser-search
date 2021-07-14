import React from 'react';
import { NextFilterStateStat } from 'browser-search';
import Chip from '@material-ui/core/Chip';
import CircularProgress from '@material-ui/core/CircularProgress';

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
    <Chip variant="default" color="primary" size="small" label={`+ ${nextFilterStateStat.nextDocumentsAdded}`}/> :
    nextFilterStateStat.type === 'narrowed' ?
    <Chip variant="default" color="primary" size="small" label={nextFilterStateStat.nextNumberOfDocuments}/> : 
    <Chip variant="default" color="secondary" size="small" label={nextFilterStateStat.matchingNumberOfDocuments}/>
  )
}