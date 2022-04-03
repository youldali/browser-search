import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import { personStoreSearchSlice } from '../../../redux';
import { useCountryValues } from '../../../hooks';
import { AppDispatch } from '../../../../../redux';
import { QuerySuspense } from '../../../../common';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const { actions, selectors } = personStoreSearchSlice;
const filterGroupKey = 'country';

export const CountryAutocomplete = () => {
  const dispatch: AppDispatch = useDispatch();
  const filtersApplied = useSelector((state) => selectors.selectFiltersAppliedForGroup(state, filterGroupKey));
  const countryValuesQueryState = useCountryValues();

  return (
      <QuerySuspense
        queryState={countryValuesQueryState}
        fallback={() => <div>An error occured</div>}
        loading={<div>Loading</div>}
      >
        {
          (options) =>
          <Autocomplete
            multiple
            limitTags={2}
            size="small"
            id="checkboxes-tags-demo"
            options={options}
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
              dispatch(actions.replaceFiltersForGroup({key: filterGroupKey, filtersApplied: filters}));
            }}
            value={filtersApplied.map(value => value.split('-')[1])}
          />
        } 
    </QuerySuspense>
  );
}
