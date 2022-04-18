import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { GroupOfFilters } from 'browser-search';

import { AppDispatch } from '../../../redux';
import { personStoreFilterConfigSlice, personStoreSearchSlice } from '../redux';
import { Person } from '../models';

const {actions: filterConfigActions} = personStoreFilterConfigSlice;
const {actions: searchActions} = personStoreSearchSlice;

export const useFilterByName = () => {
  const dispatch: AppDispatch = useDispatch();

  const addFilter = useCallback((filterByNameText: string) => {
    const nameGroupFilterConfig = getNameSearchFilterConfig(getStringSearchRange(filterByNameText));

    dispatch(filterConfigActions.replaceFilterConfigs({
      name: nameGroupFilterConfig
    }));

    dispatch(searchActions.replaceFiltersForGroup({
      key: 'name',
      filtersApplied: ['lastName', 'firstName', 'name']
    }));
  }, []);

  const resetFilter = useCallback(() => {
    dispatch(filterConfigActions.replaceFilterConfigs({
      name: []
    }));

    dispatch(searchActions.replaceFiltersForGroup({
      key: 'name',
      filtersApplied: []
    }));
  }, []);

  const onFilterByNameChanged = useCallback((filterByNameText: string) => {
    filterByNameText ? addFilter(filterByNameText) : resetFilter()
  }, [addFilter, resetFilter])

  return onFilterByNameChanged;
};

const getStringSearchRange = (string: string): [string, string] => {
  const lastCharIndex = string.length - 1;
  const lastLetterCharCode = string.charCodeAt(string.length - 1);
  const lowerBound = string;
  const upperBound = replaceAt(string, lastCharIndex, String.fromCharCode(lastLetterCharCode + 1));

  return [
    lowerBound, 
    upperBound,
  ]
}

const replaceAt = function(string: string, index: number, replacement: string) {
  return string.substring(0, index) + replacement + string.substring(index + replacement.length);
}

const getNameSearchFilterConfig = (stringSearchRange: [string, string]): GroupOfFilters<Person> => (
  [
    {id: 'lastName', field: 'lastName', operator: 'inRangeClosedOpen', operand: stringSearchRange},
    {id: 'firstName', field: 'firstName', operator: 'inRangeClosedOpen', operand: stringSearchRange},
    {id: 'name', field: 'name', operator: 'inRangeClosedOpen', operand: stringSearchRange},
  ]
)