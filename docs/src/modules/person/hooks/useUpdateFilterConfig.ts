import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Filter, GroupOfFilters, Operator } from 'browser-search';
import { mergeAll } from 'ramda';

import { AppDispatch } from '../../../redux';
import { personStoreFilterConfigSlice } from '../redux';
import { Person } from '../models';

import { countryFilterConfigKey, countryGetFilterId, useCountryValues } from './useCountryValues';
import {
    professionFilterConfigKey, professionGetFilterId, useProfessionValues,
} from './useProfessionValues';
import {
    allOfHobbiesGetFilterConfigKey, allOfHobbiesGetFilterId, hobbyFilterConfigKey, hobbyGetFilterId,
    useHobbiesValues,
} from './useHobbiesValues';

const {actions} = personStoreFilterConfigSlice;

export const useUpdateFilterConfig = () => {
  const dispatch: AppDispatch = useDispatch();
  const countryValuesQueryState = useCountryValues();
  const professionValuesQueryState = useProfessionValues();
  const hobbiesValuesQueryState = useHobbiesValues();

  useEffect(() => {
    if(countryValuesQueryState.status === 'success') {
      const filters = buildFilterConfig('country', 'equals', countryGetFilterId)(countryValuesQueryState.response);
      dispatch(actions.replaceFilterConfigs({
        [countryFilterConfigKey]: filters
      }));
    }
  }, [countryValuesQueryState])

  useEffect(() => {
    if(professionValuesQueryState.status === 'success') {
      const filters = buildFilterConfig('profession', 'equals', professionGetFilterId)(professionValuesQueryState.response);
      dispatch(actions.replaceFilterConfigs({
        [professionFilterConfigKey]: filters
      }));
    }
  }, [professionValuesQueryState])

  useEffect(() => {
    if(hobbiesValuesQueryState.status === 'success') {
      const filters = buildFilterConfig('hobbies', 'contains', hobbyGetFilterId)(hobbiesValuesQueryState.response);
      dispatch(actions.replaceFilterConfigs({
        [hobbyFilterConfigKey]: filters
      }));
    }
  }, [hobbiesValuesQueryState])

  useEffect(() => {
    if(hobbiesValuesQueryState.status === 'success') {
      const filtersConfigs = hobbiesValuesQueryState.response.map(
        hobby => ({[allOfHobbiesGetFilterConfigKey(hobby)]: buildFilterConfig('hobbies', 'contains', allOfHobbiesGetFilterId)([hobby])})
      );
      dispatch(actions.replaceFilterConfigs(mergeAll(filtersConfigs)));
    }
  }, [hobbiesValuesQueryState])
}

export const buildFilterConfig = <T>(field: keyof Person, operator: Operator, getFilterId: (value: T) => string) => (values: T[]): GroupOfFilters<Person> => {
  const filters: Filter<Person>[] = values.map((value) => {
    const id = getFilterId(value);
    return { id, field, operator, operand: value }
  });

  return filters;
}
