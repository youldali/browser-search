import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Filter, GroupOfFilters, Operator } from 'browser-search';

import { AppDispatch } from '../../../redux';
import { personStoreFilterConfigSlice } from '../redux';

import { useCountryValues } from './useCountryValues';
import { useProfessionValues } from './useProfessionValues';
import { useHobbiesValues } from './useHobbiesValues';

const {actions} = personStoreFilterConfigSlice;

export const useUpdateFilterConfig = () => {
  const dispatch: AppDispatch = useDispatch();
  const countryValuesQueryState = useCountryValues();
  const professionValuesQueryState = useProfessionValues();
  const hobbiesValuesQueryState = useHobbiesValues();

  useEffect(() => {
    if(countryValuesQueryState.status === 'success') {
      const filters = buildFilterConfig('country', 'equals')(countryValuesQueryState.response);
      dispatch(actions.replaceFilterConfigs({
        'country': filters
      }));
    }
  }, [countryValuesQueryState])

  useEffect(() => {
    if(professionValuesQueryState.status === 'success') {
      const filters = buildFilterConfig('profession', 'equals')(professionValuesQueryState.response);
      dispatch(actions.replaceFilterConfigs({
        'profession': filters
      }));
    }
  }, [professionValuesQueryState])

  useEffect(() => {
    if(hobbiesValuesQueryState.status === 'success') {
      const filters = buildFilterConfig('hobbies', 'contains')(hobbiesValuesQueryState.response);
      dispatch(actions.replaceFilterConfigs({
        'hobbies': filters
      }));
    }
  }, [hobbiesValuesQueryState])
}

const buildFilterConfig = (field: string, operator: Operator) => (values: unknown[]): GroupOfFilters<any> => {
  const filters: Filter<any>[] = values.map((value) => (
    { id: `${field}-${value}`, field: field, operator: operator, operand: value }
  ));

  return filters;
}
