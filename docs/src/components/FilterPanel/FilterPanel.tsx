import React from 'react';
import { FiltersApplied } from 'browser-search';
import { pickBy } from 'ramda';

import Toolbar from '@material-ui/core/Toolbar';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';


import { QueryState } from '../browserSearchHooks';
import { FilterId, Person } from '../../modules';
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

type Props = {
  filtersApplied: FiltersApplied<FilterId>;
  personQueryState: QueryState<Person, FilterId>;
  onFilterChange: (filtersApplied: FiltersApplied<FilterId>) => void
}


export const FilterPanel = ({
  personQueryState,
  filtersApplied,
  onFilterChange,
}: Props) => {
  const classes = useStyles();
  const filters = filtersApplied.reduce((acc: Record<FilterId, boolean>, filter): Record<FilterId, boolean> => {
    acc[filter] = true;
    return acc
  }, {} as Record<FilterId, boolean>);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, [event.target.name]: event.target.checked };
    const newFiltersApplied = Object.keys(pickBy((isApplied: boolean) => isApplied, newFilters));
    onFilterChange(newFiltersApplied as FilterId[]);
  };
  
  const resetAllFilters = () => {
    onFilterChange([]);
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
              isChecked={filters.lowAged ?? false}
              onSwitchChange={handleFilterChange}
              nextFilterStateStat={stats?.lowAged}
            />

            <SwitchField
              filterName='middleAged'
              label='Between 30 and 50 years old'
              isChecked={filters.middleAged ?? false}
              onSwitchChange={handleFilterChange}
              nextFilterStateStat={stats?.middleAged}
            />

            <SwitchField
              filterName='highAged'
              label='> 50 years old'
              isChecked={filters.highAged ?? false}
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
              isChecked={filters.lowSalary ?? false}
              onSwitchChange={handleFilterChange}
              nextFilterStateStat={stats?.lowSalary}
            />

            <SwitchField
              filterName='middleSalary'
              label='Between 40 000$ and 70 000$'
              isChecked={filters.middleSalary ?? false}
              onSwitchChange={handleFilterChange}
              nextFilterStateStat={stats?.middleSalary}
            />

            <SwitchField
              filterName='highSalary'
              label='> 70 000$'
              isChecked={filters.highSalary ?? false}
              onSwitchChange={handleFilterChange}
              nextFilterStateStat={stats?.highSalary}
            />
          </FormGroup>
        </FormControl>

      </Drawer>
  );
}

