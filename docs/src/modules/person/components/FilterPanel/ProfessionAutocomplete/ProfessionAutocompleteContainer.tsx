import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchResponse } from 'browser-search';
import Alert from '@mui/material/Alert';

import { personStoreSearchSlice } from '../../../redux';
import { useProfessionValues } from '../../../hooks';
import { AppDispatch } from '../../../../../redux';
import { QuerySuspense } from '../../../../common';
import { Person } from '../../../models';
import { CheckboxAutocompleteSkeleton } from '../../../../common/components';

import { ProfessionAutocomplete } from './ProfessionAutocomplete';

const { actions, selectors } = personStoreSearchSlice;
const filterGroupKey = 'profession';
const filterNamePrefix = 'profession-';

type Props = {
  stats: SearchResponse<Person>["stats"];
  isStatsStale: boolean;
}

export const ProfessionAutocompleteContainer = ({ stats, isStatsStale }: Props) => {
  const dispatch: AppDispatch = useDispatch();
  const filtersApplied = useSelector((state) => selectors.selectFiltersAppliedForGroup(state, filterGroupKey));
  const professionValuesQueryState = useProfessionValues();

  return (
      <QuerySuspense
        queryState={professionValuesQueryState}
        error={() => <Alert severity="error">An error occured when fetching the professions.</Alert>}
        loading={() => <CheckboxAutocompleteSkeleton />}
        idle={() => <CheckboxAutocompleteSkeleton />}
        stale={() => <CheckboxAutocompleteSkeleton />}
        success={
          (queryState) =>
            <ProfessionAutocomplete
              options={queryState.response}
              values={filtersApplied.map(value => value.split('-')[1])}
              isStatsStale={isStatsStale}
              stats={stats}
              onChange={(selectedProfession) => {
                const filters = selectedProfession.map(selectedProfession => filterNamePrefix + selectedProfession);
                dispatch(actions.replaceFiltersForGroup({key: filterGroupKey, filtersApplied: filters}));
              }}
            />
        } 
      />
  );
}
