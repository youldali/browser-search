import React from 'react';
import { SearchResponse } from 'browser-search';

import { Person } from '../../../models';
import { CheckboxAutocomplete } from '../../../../common/components';

const filterGroupKey = 'hobbies';

type Hobby = string;

type Props = {
  options: Hobby[];
  values: Hobby[];
  isStatsStale?: boolean;
  stats: SearchResponse<Person>["stats"];
  onChange(selectedHobbies: Hobby[]): void;
}

export const HobbiesAutocomplete = ({ options, values, isStatsStale = false, stats, onChange }: Props) => {
  return (
    <CheckboxAutocomplete
      options={options}
      values={values}
      id='Hobbies-Autocomplete'
      placeholder='Select 1 or many Hobbiss'
      label='Filter by Hobbies'
      isStatsStale={isStatsStale}
      onChange={(_, selectedHobbies) => onChange(selectedHobbies)}
      getNextFilterState={(option) => stats[`${filterGroupKey}-${option}`]}
    />
  );
}
