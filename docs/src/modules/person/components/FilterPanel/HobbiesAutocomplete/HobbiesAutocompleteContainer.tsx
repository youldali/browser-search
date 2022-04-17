import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchResponse } from 'browser-search';
import Alert from '@mui/material/Alert';

import { personStoreSearchSlice } from '../../../redux';
import { useHobbiesValues } from '../../../hooks';
import { AppDispatch } from '../../../../../redux';
import { QuerySuspense } from '../../../../common';
import { Person } from '../../../models';
import { CheckboxAutocompleteSkeleton } from '../../../../common/components';

import { HobbiesAutocomplete } from './HobbiesAutocomplete';

const { actions, selectors } = personStoreSearchSlice;
const filterGroupKey = 'hobbies';
const filterNamePrefix = 'hobbies-';

type Props = {
  stats: SearchResponse<Person>["stats"];
  isStatsStale: boolean;
}

export const HobbiesAutocompleteContainer = ({ stats, isStatsStale }: Props) => {
  const dispatch: AppDispatch = useDispatch();
  const filtersApplied = useSelector((state) => selectors.selectFiltersAppliedForGroup(state, filterGroupKey));
  const professionValuesQueryState = useHobbiesValues();

  return (
      <QuerySuspense
        queryState={professionValuesQueryState}
        error={() => <Alert severity="error">An error occured when fetching the hobbies.</Alert>}
        loading={() => <CheckboxAutocompleteSkeleton />}
        idle={() => <CheckboxAutocompleteSkeleton />}
        stale={() => <CheckboxAutocompleteSkeleton />}
        success={
          (queryState) =>
            <HobbiesAutocomplete
              options={queryState.response}
              values={filtersApplied.map(value => value.split('-')[1])}
              isStatsStale={isStatsStale}
              stats={stats}
              onChange={(selectedHobbies) => {
                const filters = selectedHobbies.map(selectedHobbie => filterNamePrefix + selectedHobbie);
                dispatch(actions.replaceFiltersForGroup({key: filterGroupKey, filtersApplied: filters}));
              }}
            />
        } 
      />
  );
}
