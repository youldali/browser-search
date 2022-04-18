import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'react-use';
import Box from '@mui/material/Box';
import ListSubheader from '@mui/material/ListSubheader';
import TextField from '@mui/material/TextField';
import { operators } from 'browser-search/dist/modules/filterConfiguration';

import { AppDispatch } from '../../../../../redux';
import { debounceInputTime } from '../../../../../config';
import {
    personStoreFilterConfigSlice, personStoreSearchSlice, personUiStoreSlice,
} from '../../../redux';
import { buildFilterConfig } from '../../../hooks';

const {actions: filterConfigActions} = personStoreFilterConfigSlice;
const {actions: searchActions} = personStoreSearchSlice;
const {actions: uiActions, selectors} = personUiStoreSlice;

export const FilterByNameSection = () => {
  const filterText = useSelector(selectors.selectByNameText);
  const dispatch: AppDispatch = useDispatch();

  const onFilter = () => {
    if(filterText) {
      const filterConfig = buildFilterConfig('name', 'inRangeOpen', () => 'name')([getRange(filterText)] as any);
      dispatch(filterConfigActions.replaceFilterConfigs({
        name: filterConfig
      }));
      dispatch(searchActions.replaceFiltersForGroup({
        key: 'name',
        filtersApplied: ['name']
      }));
    }
    else {
      dispatch(searchActions.replaceFiltersForGroup({
        key: 'name',
        filtersApplied: []
      }));
    }
  }

  useDebounce(onFilter, debounceInputTime, [filterText]);

  return (
    <div>
        <TextField 
          id="filter-by-name" 
          label="By name" 
          variant="filled" 
          placeholder='Start typing' 
          value={filterText}
          onChange={(event) => dispatch(uiActions.setByNameFilterText(event.target.value))}
          size="small"
          fullWidth
          margin='normal'
        />
    </div>
  )
};

const getRange = (string: string): [string, string] => {
  const lastCharIndex = string.length - 1;
  const lastLetterCharCode = string.charCodeAt(string.length - 1);
  const lowerBound = string
  return [
    string + String.fromCharCode(1), 
    replaceAt(string, lastCharIndex, String.fromCharCode(lastLetterCharCode + 1))]
}

const replaceAt = function(string: string, index: number, replacement: string) {
  return string.substring(0, index) + replacement + string.substring(index + replacement.length);
}