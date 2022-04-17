import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Filter, GroupOfFilters } from 'browser-search';
import { GenericQueryState } from 'react-browser-search';

import { AppDispatch } from '../../../redux';
import { personStoreFilterConfigSlice } from '../redux';

import { useCountryValues } from './useCountryValues';
import { useProfessionValues } from './useProfessionValues';

const {actions} = personStoreFilterConfigSlice;

export const useUpdateFilterConfig = () => {
  const dispatch: AppDispatch = useDispatch();
  const countryValuesQueryState = useCountryValues();
  const professionValuesQueryState = useProfessionValues();

  useEffect(() => {
    if(countryValuesQueryState.status === 'success') {
      const filters = buildFilterConfig('country')(countryValuesQueryState.response);
      dispatch(actions.replaceFilterConfigs({
        'country': filters
      }));
    }
  }, [countryValuesQueryState])

  useEffect(() => {
    if(professionValuesQueryState.status === 'success') {
      const filters = buildFilterConfig('profession')(professionValuesQueryState.response);
      dispatch(actions.replaceFilterConfigs({
        'profession': filters
      }));
    }
  }, [professionValuesQueryState])
}

const buildFilterConfig = (field: string) => (values: unknown[]): GroupOfFilters<any> => {
  const filters: Filter<any>[] = values.map((value) => (
    { id: `${field}-${value}`, field: field, operator: 'contains', operand: value }
  ));

  return filters;
}
