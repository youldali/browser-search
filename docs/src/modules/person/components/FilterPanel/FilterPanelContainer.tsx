import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch } from '../../../../redux';
import { personStoreSearchSlice } from '../../redux';
import { usePersonQuery } from '../../hooks';
import { QuerySuspense } from '../../../common';

import { FilterPanel } from './FilterPanel';

const { actions, selectors } = personStoreSearchSlice;

const filterGroupKey = 'base';

export const FilterPanelContainer = () => {
  const dispatch: AppDispatch = useDispatch();
  const filtersAppliedAsRecord = useSelector((state) => selectors.selectFiltersAppliedRecordForGroup(state, filterGroupKey));
  const filtersApplied = useSelector(selectors.selectFiltersApplied);
  const personQueryState = usePersonQuery();

  const onSwitchFilter = (payload: {key: string, filter: string}) => {
    dispatch(actions.switchFilterForGroup(payload));
  };
  
  const resetAllFilters = () => {
    dispatch(actions.resetFilters());
  };

  return (
    <QuerySuspense
      queryState={personQueryState}
      idle={() => <div>An error occured</div>}
      loading={() => <span>loading</span>}
      error={() => <div>An error occured</div>}
      stale={
        (state) =>
        <FilterPanel
          isStale={state.trigger === 'store-mutation' || state.request.filtersApplied !== state.newRequest.filtersApplied}
          response={state.response}
          filtersAppliedAsRecord={filtersAppliedAsRecord}
          filtersApplied={filtersApplied}
          onResetFilters={resetAllFilters}
          onSwitchFilter={onSwitchFilter}
        />
      } 
      success={
        ({response}) =>
        <FilterPanel
          response={response}
          filtersAppliedAsRecord={filtersAppliedAsRecord}
          filtersApplied={filtersApplied}
          onResetFilters={resetAllFilters}
          onSwitchFilter={onSwitchFilter}
        />
      } 
    />
  );
}

