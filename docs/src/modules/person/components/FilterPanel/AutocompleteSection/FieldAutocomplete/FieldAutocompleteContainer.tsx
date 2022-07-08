import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UseIndexValuesQueryState } from '@browser-search/react-browser-search';
import Alert from '@mui/material/Alert';
import { string } from 'yup';

import { personStoreSearchSlice } from '../../../../redux';
import { AppDispatch } from '../../../../../../redux';
import { QuerySuspense } from '../../../../../common';
import { CheckboxAutocompleteSkeleton } from '../../../../../common/components';

import { FieldAutocomplete, Props as FieldAutocompleteProps } from './FieldAutocomplete';

const { actions, selectors } = personStoreSearchSlice;

type Props<FieldValue extends string> = {
  filterAppliedGroupKey: string;
  indexValuesQueryState: UseIndexValuesQueryState<FieldValue>;
  errorMessage: string;
  getFilterId(value: FieldValue): string;
} & Omit<FieldAutocompleteProps<FieldValue>, 'values' | 'options' | 'onChange'>

export const FieldAutocompleteContainer = <FieldValue extends string>({ 
  getFilterId,
  filterAppliedGroupKey,
  indexValuesQueryState,
  errorMessage,
  ...rest
}: Props<FieldValue>) => {
  const dispatch: AppDispatch = useDispatch();
  const filtersApplied = useSelector((state) => selectors.selectFiltersAppliedForGroup(state, filterAppliedGroupKey));

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
              getFilterId={getFilterId}
              options={queryState.response}
              values={filtersApplied.map(value => value.split('-').pop() as string)}
              onChange={(selectedValues: FieldValue[]) => {
                const filters = selectedValues.map(selectedValue => getFilterId(selectedValue));
                dispatch(actions.replaceFiltersForGroup({key: filterAppliedGroupKey, filtersApplied: filters}));
              }}
            />
        } 
      />
  );
}
