import React from 'react';
import ListSubheader from '@mui/material/ListSubheader';

import {
    PersonQueryResponse, useCountryValues, useHobbiesValues, useProfessionValues,
} from '../../../hooks';

import { FieldAutocomplete } from './FieldAutocomplete';

type Props = {
  response: PersonQueryResponse;
  isStale?: boolean;
}

export const AutocompleteSection = ({
  response: {stats},
  isStale = false,
}: Props) => {
  const countryValuesQueryState = useCountryValues();
  const professionValuesQueryState = useProfessionValues();
  const hobbiesValuesQueryState = useHobbiesValues();

  console.log(stats);
  return (
    <div>
        <ListSubheader disableSticky>By country</ListSubheader>
        <FieldAutocomplete 
          filterGroupKey='country'
          stats={stats} 
          isStatsStale={isStale} 
          indexValuesQueryState={countryValuesQueryState}
          errorMessage='An error occured fetching the countries'
          id='Country-Autocomplete'
          placeholder='Select 1 or many countries'
          label='Filter by countries'
        />

        <ListSubheader disableSticky>By Profession</ListSubheader>
        <FieldAutocomplete 
          filterGroupKey='profession'
          stats={stats} 
          isStatsStale={isStale} 
          indexValuesQueryState={professionValuesQueryState}
          errorMessage='An error occured fetching the profession'
          id='profession-Autocomplete'
          placeholder='Select 1 or many professions'
          label='Filter by professions'
        />

        <ListSubheader disableSticky>By Hobbies</ListSubheader>
        <FieldAutocomplete 
          filterGroupKey='hobbies'
          stats={stats} 
          isStatsStale={isStale} 
          indexValuesQueryState={hobbiesValuesQueryState}
          errorMessage='An error occured fetching the hobbies'
          id='hobbies-Autocomplete'
          placeholder='Select 1 or many hobbies'
          label='Filter by hobbies'
        />
    </div>
  );
}

