import React, { ReactNode } from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { NextFilterStateStat } from 'browser-search';

import { ChipFilterStat } from '../../../../common/components';

type Props = {
  onFilterChange: (filterName: string) => void;
  nextFilterStateStat?: NextFilterStateStat;
  isChecked: boolean;
  label: ReactNode;
  filterName: string;
}


export const FilterListItem = ({
  onFilterChange,
  isChecked,
  label,
  filterName,
  nextFilterStateStat,
}: Props) => {

  return (
    <ListItem
      disablePadding
      disableGutters
      sx={{
        '& .MuiListItemButton-root': {
          px:0,
        },
      }}
    >
      <ListItemButton role={undefined} onClick={() => onFilterChange(filterName)} dense>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={isChecked}
            tabIndex={-1}
            disableRipple
            inputProps={{ 'aria-labelledby': filterName }}
          />
        </ListItemIcon>
        <Box sx={{display: 'flex', justifyContent: 'space-around', width: '100%',}}>
          <ListItemText id={filterName} primary={label} />
          <ChipFilterStat nextFilterStateStat={nextFilterStateStat} />
        </Box>
      </ListItemButton>
    </ListItem>
  )
  
};
