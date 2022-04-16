import React from 'react';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { SearchResponse } from 'browser-search';

import { personStoreSearchSlice } from '../../../redux';
import { Person } from '../../../models';
import { CheckboxAutocomplete } from '../../../../common/components';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const { actions, selectors } = personStoreSearchSlice;
const filterGroupKey = 'country';

type Country = string;

type Props = {
  options: Country[];
  values: Country[];
  isStatsStale?: boolean;
  stats: SearchResponse<Person>["stats"];
  onChange(selectedCountries: Country[]): void;
}

export const CountryAutocomplete = ({ options, values, isStatsStale = false, stats, onChange }: Props) => {
  return (
    <CheckboxAutocomplete
      options={options}
      values={values}
      id='Country-Autocomplete'
      placeholder='Select 1 or many countries'
      label='Filter by countries'
      isStatsStale={isStatsStale}
      onChange={(_, selectedCountries) => onChange(selectedCountries)}
      getNextFilterState={(option) => stats[`${filterGroupKey}-${option}`]}
    />
  );
}
