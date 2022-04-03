import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Toolbar from '@mui/material/Toolbar';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import Button from '@mui/material/Button';

import { AppDispatch } from '../../../../redux';
import { FilterId } from '../../browserSearch';
import { personStoreSearchSlice } from '../../redux';
import { usePersonQuery } from '../../hooks';

import { SwitchField } from './SwitchField';
import { CountryAutocomplete } from './CountryAutocomplete';

const { actions, selectors } = personStoreSearchSlice;

const drawerWidth = 280;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: drawerWidth,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: 'auto',
    },
  }),
);

const filterGroupKey = 'base';

export const FilterPanel = () => {
  const dispatch: AppDispatch = useDispatch();
  const filtersAppliedAsRecord = useSelector((state) => selectors.selectFiltersAppliedRecordForGroup(state, filterGroupKey));
  const personQueryState = usePersonQuery();

  const classes = useStyles();

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(actions.switchFilterForGroup({key: filterGroupKey, filter: event.target.name as FilterId}));
  };
  
  const resetAllFilters = () => {
    dispatch(actions.resetFilters());
  };

  const stats = personQueryState.status === 'success' ? personQueryState.response.stats : null;

  return (
      <Drawer
        variant="permanent"
        anchor="left"
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />

        <div>
          <Button 
          variant="contained" 
          color="primary"
          onClick={resetAllFilters}
          >
            Reset all
          </Button>
        </div>

        <Divider />

        <FormControl component="fieldset">
          <FormLabel component="legend">By age</FormLabel>
          <FormGroup>
            <SwitchField
              filterName='lowAged'
              label='< 30 years old'
              isChecked={filtersAppliedAsRecord.lowAged ?? false}
              onSwitchChange={handleFilterChange}
              nextFilterStateStat={stats?.lowAged}
            />

            <SwitchField
              filterName='middleAged'
              label='Between 30 and 50 years old'
              isChecked={filtersAppliedAsRecord.middleAged ?? false}
              onSwitchChange={handleFilterChange}
              nextFilterStateStat={stats?.middleAged}
            />

            <SwitchField
              filterName='highAged'
              label='> 50 years old'
              isChecked={filtersAppliedAsRecord.highAged ?? false}
              onSwitchChange={handleFilterChange}
              nextFilterStateStat={stats?.highAged}
            />
          </FormGroup>
        </FormControl>

        <Divider />

        <FormControl component="fieldset">
          <FormLabel component="legend">By salary</FormLabel>
          <FormGroup>
            <SwitchField
              filterName='lowSalary'
              label='< 40 000$'
              isChecked={filtersAppliedAsRecord.lowSalary ?? false}
              onSwitchChange={handleFilterChange}
              nextFilterStateStat={stats?.lowSalary}
            />

            <SwitchField
              filterName='middleSalary'
              label='Between 40 000$ and 70 000$'
              isChecked={filtersAppliedAsRecord.middleSalary ?? false}
              onSwitchChange={handleFilterChange}
              nextFilterStateStat={stats?.middleSalary}
            />

            <SwitchField
              filterName='highSalary'
              label='> 70 000$'
              isChecked={filtersAppliedAsRecord.highSalary ?? false}
              onSwitchChange={handleFilterChange}
              nextFilterStateStat={stats?.highSalary}
            />
          </FormGroup>
        </FormControl>

        <FormControl component="fieldset">
          <FormLabel component="legend">By country</FormLabel>
          <FormGroup>
            <CountryAutocomplete />
          </FormGroup>
        </FormControl>

      </Drawer>
  );
}

