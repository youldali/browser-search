import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { grey } from '@mui/material/colors';
import { NextFilterStateStat } from 'browser-search';

import { ChipFilterStat } from '../ChipFilterStat';

const checkboxUncheckedIcon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkboxCheckedIcon = <CheckBoxIcon fontSize="small" />;

type Props<Option> = {
  options: Option[],
  id: string,
  values: Option[],
  placeholder: string;
  label: string;
  isStatsStale: boolean;
  onChange(event: React.SyntheticEvent<Element, Event>, values: Option[]): void;
  getNextFilterState(option: Option): NextFilterStateStat;
}

export const CheckboxAutocomplete = <Option extends string>({ options, id, values, placeholder, label, isStatsStale, onChange, getNextFilterState }: Props<Option>) => {
  return (
    <Autocomplete
      disableCloseOnSelect
      multiple
      limitTags={2}
      size="small"
      id={id}
      options={options}
      renderOption={(props, option, { selected }) => (
        <li {...props} style={{background: grey[100]}}>
          <Checkbox
            icon={checkboxUncheckedIcon}
            checkedIcon={checkboxCheckedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
            size='small'
          />
          <Box sx={{display: 'flex', justifyContent: 'space-between', width: '100%', position: 'relative'}}>
            <Typography variant="body2">
              {option}
            </Typography>
            <ChipFilterStat nextFilterStateStat={getNextFilterState(option)} isStale={isStatsStale} />
          </Box>
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} label={label} placeholder={placeholder} />
      )}
      onChange={onChange}
      value={values}
    />
  );
}
