import React from 'react';
import { SearchResponse } from 'browser-search';

import { Person } from '../../../models';
import { CheckboxAutocomplete } from '../../../../common/components';

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
