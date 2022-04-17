import React from 'react';
import { SearchResponse } from 'browser-search';

import { Person } from '../../../models';
import { CheckboxAutocomplete } from '../../../../common/components';

const filterGroupKey = 'profession';

type Profession = string;

type Props = {
  options: Profession[];
  values: Profession[];
  isStatsStale?: boolean;
  stats: SearchResponse<Person>["stats"];
  onChange(selectedProfessions: Profession[]): void;
}

export const ProfessionAutocomplete = ({ options, values, isStatsStale = false, stats, onChange }: Props) => {
  console.log(options);
  return (
    <CheckboxAutocomplete
      options={options}
      values={values}
      id='Profession-Autocomplete'
      placeholder='Select 1 or many professions'
      label='Filter by professions'
      isStatsStale={isStatsStale}
      onChange={(_, selectedProfessions) => onChange(selectedProfessions)}
      getNextFilterState={(option) => stats[`${filterGroupKey}-${option}`]}
    />
  );
}
