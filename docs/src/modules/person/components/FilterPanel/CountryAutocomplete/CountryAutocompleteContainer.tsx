import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchResponse } from 'browser-search';

import { personStoreSearchSlice } from '../../../redux';
import { useCountryValues } from '../../../hooks';
import { AppDispatch } from '../../../../../redux';
import { QuerySuspense } from '../../../../common';
import { Person } from '../../../models';
import { CheckboxAutocompleteSkeleton } from '../../../../common/components';

import { CountryAutocomplete } from './CountryAutocomplete';

const { actions, selectors } = personStoreSearchSlice;
const filterGroupKey = 'country';

type Props = {
  stats: SearchResponse<Person>["stats"];
  isStatsStale: boolean;
}

export const CountryAutocompleteContainer = ({ stats, isStatsStale }: Props) => {
  const dispatch: AppDispatch = useDispatch();
  const filtersApplied = useSelector((state) => selectors.selectFiltersAppliedForGroup(state, filterGroupKey));
  const countryValuesQueryState = useCountryValues();

  return (
      <QuerySuspense
        queryState={countryValuesQueryState}
        error={() => <div>An error occured</div>}
        loading={() => <CheckboxAutocompleteSkeleton />}
        idle={() => <CheckboxAutocompleteSkeleton />}
        stale={() => <CheckboxAutocompleteSkeleton />}
        success={
          (queryState) =>
            <CountryAutocomplete
              options={queryState.response}
              values={filtersApplied.map(value => value.split('-')[1])}
              isStatsStale={isStatsStale}
              stats={stats}
              onChange={(selectedCountries) => {
                const filters = selectedCountries.map(selectedCountry => 'country-' + selectedCountry);
                dispatch(actions.replaceFiltersForGroup({key: filterGroupKey, filtersApplied: filters}));
              }}
            />
        } 
      />
  );
}
