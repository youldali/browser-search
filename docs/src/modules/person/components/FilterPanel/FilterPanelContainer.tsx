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
        fallback={() => <div>An error occured</div>}
        loading={<span>loading</span>}
      >
        {
          (response) =>
          <FilterPanel
            response={response}
            filtersAppliedAsRecord={filtersAppliedAsRecord}
            onResetFilters={resetAllFilters}
            onSwitchFilter={onSwitchFilter}
          />
        } 
    </QuerySuspense>
  );
}
