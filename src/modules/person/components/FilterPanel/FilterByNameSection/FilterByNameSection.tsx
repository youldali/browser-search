import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'react-use';
import TextField from '@mui/material/TextField';

import { AppDispatch } from '../../../../../redux';
import { debounceInputTime } from '../../../../../config';
import { personUiStoreSlice } from '../../../redux';
import { useFilterByName } from '../../../hooks';

const {actions: uiActions, selectors} = personUiStoreSlice;

export const FilterByNameSection = () => {
  const dispatch: AppDispatch = useDispatch();

  const filterByNameText = useSelector(selectors.selectByNameText);
  const filterByName = useFilterByName();

  useDebounce(() => filterByName(filterByNameText), debounceInputTime, [filterByName, filterByNameText]);

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
