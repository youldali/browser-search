import React from 'react';
import { QueryResponse } from '@browser-search/browser-search';

import { Person } from '../../../../models';
import { CheckboxAutocomplete } from '../../../../../common/components';

export type Props<FieldValue extends string> = {
  options: FieldValue[];
  values: FieldValue[];
  isStatsStale?: boolean;
  stats: QueryResponse<Person>["stats"];
  id: string;
  placeholder: string;
  label: string;
  getFilterId(value: FieldValue): string;
  onChange(selectedProfessions: FieldValue[]): void;
}

export const FieldAutocomplete = <FieldValue extends string>({ 
  id,
  label,
  placeholder,
  options, 
  values, 
  isStatsStale = false, 
  stats, 
  getFilterId,
  onChange,
}: Props<FieldValue>) => {
  return (
    <CheckboxAutocomplete
      options={options}
      values={values}
      id={id}
      placeholder={placeholder}
      label={label}
      isStatsStale={isStatsStale}
      onChange={(_, selectedValues) => onChange(selectedValues)}
      getNextFilterState={(option) => stats[getFilterId(option)]}
    />
  );
}
