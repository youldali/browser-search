import React, { ReactNode } from 'react';
import { NextFilterStateStat } from 'browser-search';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';

import { ChipFilterStat } from './ChipFilterStat';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    filterLabel: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    filterControlLabel: {
      flexGrow: 1,
    },
  }),
);

type Props = {
  onSwitchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  nextFilterStateStat?: NextFilterStateStat;
  isChecked: boolean;
  label: ReactNode;
  filterName: string;
}


export const SwitchField = ({
  onSwitchChange,
  isChecked,
  label,
  filterName,
  nextFilterStateStat,
}: Props) => {
  const classes = useStyles();

  return (
    <FormControlLabel
      control={<Switch checked={isChecked} onChange={onSwitchChange} name={filterName} />}
      label={<FilterLabel>{label} <ChipFilterStat nextFilterStateStat={nextFilterStateStat} /></FilterLabel>}
      classes={{label: classes.filterControlLabel}}
    />
  )
  
};


type FilterLabelProps = {
  children: ReactNode;
}

const FilterLabel = ({children}: FilterLabelProps) => {
  const classes = useStyles();

  return (
    <Typography 
      variant="button" 
      display="block" 
      gutterBottom
      className={classes.filterLabel}
    >
      {children}
    </Typography>
  );
}
