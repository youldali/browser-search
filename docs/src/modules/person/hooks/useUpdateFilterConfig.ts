import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Filter, FilterConfig } from 'browser-search';

import { AppDispatch } from '../../../redux';
import { replaceFilterConfig } from '../redux';

import { useCountryValues } from './useCountryValues';

export const useUpdateFilterConfig = () => {
  const dispatch: AppDispatch = useDispatch();
  const countryValuesQueryState = useCountryValues();

  useEffect(() => {
    if(countryValuesQueryState.status === 'success') {
      const filters = buildFilterConfig('country')(countryValuesQueryState.response);
      dispatch(replaceFilterConfig({
        key: 'country',
        value: filters
      }));
    }
  }, [countryValuesQueryState])
}

const buildFilterConfig = (field: string) => (values: unknown[]): FilterConfig<any> => {
  const filters: Filter<any>[] = values.map((value) => (
    { id: `${field}-${value}`, field: field, operator: 'contains', operand: value }
  ));

  return [filters];
}