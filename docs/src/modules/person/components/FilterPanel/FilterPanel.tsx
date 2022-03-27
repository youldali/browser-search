import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Toolbar from '@material-ui/core/Toolbar';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import Button from '@material-ui/core/Button';

import { AppDispatch } from '../../../../redux';
import { FilterId } from '../../browserSearch';
import { resetFilters, selectFiltersAppliedAsRecord, switchFilter } from '../../redux';
import { usePersonQuery } from '../../hooks';

import { SwitchField } from './SwitchField';

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

export const FilterPanel = () => {
  const dispatch: AppDispatch = useDispatch();
  const filtersAppliedAsRecord = useSelector(selectFiltersAppliedAsRecord);
  const personQueryState = usePersonQuery();

  const classes = useStyles();

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(switchFilter(event.target.name as FilterId));
  };
  
  const resetAllFilters = () => {
    dispatch(resetFilters());
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

      </Drawer>
  );
}

