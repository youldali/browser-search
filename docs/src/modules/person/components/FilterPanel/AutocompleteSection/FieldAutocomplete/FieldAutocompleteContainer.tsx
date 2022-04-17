import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UseIndexValuesQueryState } from 'react-browser-search';
import Alert from '@mui/material/Alert';

import { personStoreSearchSlice } from '../../../../redux';
import { AppDispatch } from '../../../../../../redux';
import { QuerySuspense } from '../../../../../common';
import { CheckboxAutocompleteSkeleton } from '../../../../../common/components';

import { FieldAutocomplete, Props as FieldAutocompleteProps } from './FieldAutocomplete';

const { actions, selectors } = personStoreSearchSlice;

type Props<FieldValues extends string> = {
  filterGroupKey: string;
  indexValuesQueryState: UseIndexValuesQueryState<FieldValues>;
  errorMessage: string;
} & Omit<FieldAutocompleteProps<FieldValues>, 'values' | 'options' | 'onChange'>

export const FieldAutocompleteContainer = <FieldValues extends string>({ 
  filterGroupKey,
  indexValuesQueryState,
  errorMessage,
  ...rest
}: Props<FieldValues>) => {
  const dispatch: AppDispatch = useDispatch();
  const filtersApplied = useSelector((state) => selectors.selectFiltersAppliedForGroup(state, filterGroupKey));

  return (
      <QuerySuspense
        queryState={indexValuesQueryState}
        error={() => <Alert severity="error">{errorMessage}</Alert>}
        loading={() => <CheckboxAutocompleteSkeleton />}
        idle={() => <CheckboxAutocompleteSkeleton />}
        stale={() => <CheckboxAutocompleteSkeleton />}
        success={
          (queryState) =>
            <FieldAutocomplete
              {...rest}
              filterGroupKey={filterGroupKey}
              options={queryState.response}
              values={filtersApplied.map(value => value.split('-')[1])}
              onChange={(selectedProfession) => {
                const filters = selectedProfession.map(selectedProfession => filterGroupKey + '-' + selectedProfession);
                dispatch(actions.replaceFiltersForGroup({key: filterGroupKey, filtersApplied: filters}));
              }}
            />
        } 
      />
  );
}
