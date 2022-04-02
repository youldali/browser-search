import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import { replaceFiltersApplied, selectFiltersAppliedForGroup } from '../../../redux';
import { useCountryValues } from '../../../hooks';
import { AppDispatch } from '../../../../../redux';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const filterGroupKey = 'country';

export const CountryAutocomplete = () => {
  const dispatch: AppDispatch = useDispatch();
  const filtersApplied = useSelector(selectFiltersAppliedForGroup(filterGroupKey));
  const countryValuesQueryState = useCountryValues();

  return (
    <Autocomplete
      multiple
      limitTags={2}
      size="small"
      id="checkboxes-tags-demo"
      options={countryValuesQueryState.status === 'success' ? countryValuesQueryState.response : []}
      disableCloseOnSelect
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={selected}
          />
          {option}
        </li>
      )}
      renderInput={(params) => (
        <TextField {...params} label="Checkboxes" placeholder="Filter by countries" />
      )}
      onChange={(_, values) => {
        const filters = values.map(value => 'country-' + value);
        dispatch(replaceFiltersApplied({key: filterGroupKey, filtersApplied: filters}));
      }}
      value={filtersApplied.map(value => value.split('-')[1])}
    />
  );
}
