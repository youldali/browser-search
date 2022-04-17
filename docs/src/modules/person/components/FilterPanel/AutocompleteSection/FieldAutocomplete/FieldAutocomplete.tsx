import React from 'react';
import { SearchResponse } from 'browser-search';

import { Person } from '../../../../models';
import { CheckboxAutocomplete } from '../../../../../common/components';

export type Props<FieldValues extends string> = {
  options: FieldValues[];
  values: FieldValues[];
  isStatsStale?: boolean;
  stats: SearchResponse<Person>["stats"];
  id: string;
  placeholder: string;
  label: string;
  filterGroupKey: string;
  onChange(selectedProfessions: FieldValues[]): void;
}

export const FieldAutocomplete = <FieldValues extends string>({ 
  id,
  label,
  placeholder,
  options, 
  values, 
  isStatsStale = false, 
  stats, 
  filterGroupKey,
  onChange,
}: Props<FieldValues>) => {
  return (
    <CheckboxAutocomplete
      options={options}
      values={values}
      id={id}
      placeholder={placeholder}
      label={label}
      isStatsStale={isStatsStale}
      onChange={(_, selectedValues) => onChange(selectedValues)}
      getNextFilterState={(option) => stats[`${filterGroupKey}-${option}`]}
    />
  );
}
