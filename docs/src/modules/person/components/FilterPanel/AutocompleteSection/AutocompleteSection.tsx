import React from 'react';
import ListSubheader from '@mui/material/ListSubheader';

import {
    allOfHobbiesFilterAppliedGroupKey, allOfHobbiesGetFilterId, countryFilterAppliedGroupKey,
    countryGetFilterId, hobbyFilterAppliedGroupKey, hobbyGetFilterId, PersonQueryResponse,
    professionFilterAppliedGroupKey, professionGetFilterId, useCountryValues, useHobbiesValues,
    useProfessionValues,
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

  return (
    <div>
        <ListSubheader disableSticky>By country</ListSubheader>
        <FieldAutocomplete 
          filterAppliedGroupKey={countryFilterAppliedGroupKey}
          getFilterId={countryGetFilterId}
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
          filterAppliedGroupKey={professionFilterAppliedGroupKey}
          getFilterId={professionGetFilterId}
          stats={stats} 
          isStatsStale={isStale} 
          indexValuesQueryState={professionValuesQueryState}
          errorMessage='An error occured fetching the profession'
          id='profession-Autocomplete'
          placeholder='Select 1 or many professions'
          label='Filter by professions'
        />

        <ListSubheader disableSticky>By Hobbies (one of)</ListSubheader>
        <FieldAutocomplete 
          filterAppliedGroupKey={hobbyFilterAppliedGroupKey}
          getFilterId={hobbyGetFilterId}
          stats={stats} 
          isStatsStale={isStale} 
          indexValuesQueryState={hobbiesValuesQueryState}
          errorMessage='An error occured fetching the hobbies'
          id='hobbies-Autocomplete'
          placeholder='Select 1 or many hobbies'
          label='Filter by hobbies (one of)'
        />

        <ListSubheader disableSticky>By Hobbies (all of)</ListSubheader>
        <FieldAutocomplete 
          filterAppliedGroupKey={allOfHobbiesFilterAppliedGroupKey}
          getFilterId={allOfHobbiesGetFilterId}
          stats={stats} 
          isStatsStale={isStale} 
          indexValuesQueryState={hobbiesValuesQueryState}
          errorMessage='An error occured fetching the hobbies'
          id='hobbiesAllOf-Autocomplete'
          placeholder='Select 1 or many hobbies'
          label='Filter by hobbies (all of)'
        />
    </div>
  );
}

