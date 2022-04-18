import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch } from '../../../../redux';
import { personStoreSearchSlice, personUiStoreSlice } from '../../redux';
import { usePersonQuery } from '../../hooks';
import { QuerySuspense } from '../../../common';

import { FilterPanel } from './FilterPanel';
import { FilterPanelSkeleton } from './FilterPanelSkeleton';
import { FilterPanelError } from './FilterPanelError';

const { actions: searchActions, selectors: searchSelectors } = personStoreSearchSlice;
const { selectors: uiSelectors } = personUiStoreSlice;

const filterGroupKey = 'base';

export const FilterPanelContainer = () => {
  const dispatch: AppDispatch = useDispatch();
  const filtersAppliedAsRecord = useSelector((state) => searchSelectors.selectFiltersAppliedRecordForGroup(state, filterGroupKey));
  const filtersApplied = useSelector(searchSelectors.selectFiltersApplied);
  const filtersAppliedCount = useSelector(uiSelectors.selectNumberOfFilters);
  const personQueryState = usePersonQuery();

  const onSwitchFilter = (payload: {key: string, filter: string}) => {
    dispatch(searchActions.switchFilterForGroup(payload));
  };
  
  const resetAllFilters = () => {
    dispatch(searchActions.resetFilters());
  };

  return (
    <QuerySuspense
      queryState={personQueryState}
      idle={() => <FilterPanelSkeleton />}
      loading={() => <FilterPanelSkeleton />}
      error={() => <FilterPanelError />}
      stale={
        (state) => (
          <FilterPanel
            isStale={state.areStatsStale}
            response={state.response}
            filtersAppliedAsRecord={filtersAppliedAsRecord}
            filtersAppliedCount={filtersAppliedCount}
            onResetFilters={resetAllFilters}
            onSwitchFilter={onSwitchFilter}
          />
        )
      }
      success={
        ({response}) =>
        <FilterPanel
          response={response}
          filtersAppliedAsRecord={filtersAppliedAsRecord}
          filtersAppliedCount={filtersAppliedCount}
          onResetFilters={resetAllFilters}
          onSwitchFilter={onSwitchFilter}
        />
      } 
    />
  );
}

