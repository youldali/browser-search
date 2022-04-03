import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Filter, GroupOfFilters } from 'browser-search';

import { AppDispatch } from '../../../redux';
import { personStoreFilterConfigSlice } from '../redux';

import { useCountryValues } from './useCountryValues';

const {actions} = personStoreFilterConfigSlice;

export const useUpdateFilterConfig = () => {
  const dispatch: AppDispatch = useDispatch();
  const countryValuesQueryState = useCountryValues();

  useEffect(() => {
    if(countryValuesQueryState.status === 'success') {
      const filters = buildFilterConfig('country')(countryValuesQueryState.response);
      dispatch(actions.replaceFilterConfigs({
        'country': filters
      }));
    }
  }, [countryValuesQueryState])
}

const buildFilterConfig = (field: string) => (values: unknown[]): GroupOfFilters<any> => {
  const filters: Filter<any>[] = values.map((value) => (
    { id: `${field}-${value}`, field: field, operator: 'contains', operand: value }
  ));

  return filters;
}
