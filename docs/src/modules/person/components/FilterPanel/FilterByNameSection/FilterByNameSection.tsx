import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'react-use';
import TextField from '@mui/material/TextField';
import { Filter, GroupOfFilters, Operator } from 'browser-search';

import { AppDispatch } from '../../../../../redux';
import { debounceInputTime } from '../../../../../config';
import {
    personStoreFilterConfigSlice, personStoreSearchSlice, personUiStoreSlice,
} from '../../../redux';
import { buildFilterConfig } from '../../../hooks';
import { Person } from '../../../models';

const {actions: filterConfigActions} = personStoreFilterConfigSlice;
const {actions: searchActions} = personStoreSearchSlice;
const {actions: uiActions, selectors} = personUiStoreSlice;

export const FilterByNameSection = () => {
  const filterByNameText = useSelector(selectors.selectByNameText);
  const dispatch: AppDispatch = useDispatch();

  const addFilter = useCallback(() => {
    const nameFilterConfig = getNameSearchFilterConfig(getStringSearchRange(filterByNameText));

    dispatch(filterConfigActions.replaceFilterConfigs({
      name: nameFilterConfig
    }));

    dispatch(searchActions.replaceFiltersForGroup({
      key: 'name',
      filtersApplied: ['lastName', 'firstName', 'name']
    }));
  }, [filterByNameText]);

  const resetFilter = useCallback(() => {
    dispatch(searchActions.replaceFiltersForGroup({
      key: 'name',
      filtersApplied: []
    }));
  }, []);

  const onFilterByNameChanged = useCallback(() => {
    filterByNameText ? addFilter() : resetFilter()
  }, [filterByNameText, addFilter, resetFilter])

  useDebounce(onFilterByNameChanged, debounceInputTime, [onFilterByNameChanged]);

  return (
    <div>
        <TextField 
          id="filter-by-name" 
          label="By name" 
          variant="filled" 
          placeholder='Start typing' 
          value={filterByNameText}
          onChange={(event) => dispatch(uiActions.setByNameFilterText(event.target.value.toLocaleLowerCase()))}
          size="small"
          fullWidth
          margin='normal'
        />
    </div>
  )
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