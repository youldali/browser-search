import React, { ReactNode } from 'react';
import { FiltersApplied, NextFilterStateStat } from 'browser-search';
import { pickBy } from 'ramda';

import Toolbar from '@material-ui/core/Toolbar';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';

import { QueryState } from '../browserSearchHooks';
import { FilterId, Person } from '../../modules';


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
    filterLabel: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    filterControlLabel: {
      flexGrow: 1,
    }
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
            <FormControlLabel
              control={<Switch checked={filters.lowAged ?? false} onChange={handleFilterChange} name="lowAged" />}
              label={<FilterLabel>{'<'} 30 years old <FilterStat nextFilterStateStat={stats?.lowAged} /></FilterLabel>}
              classes={{label: classes.filterControlLabel}}
            />
            <FormControlLabel
              control={<Switch checked={filters.middleAged ?? false} onChange={handleFilterChange} name="middleAged" />}
              label={<FilterLabel>Between 30 and 50 years old <FilterStat nextFilterStateStat={stats?.middleAged} /></FilterLabel>}
              classes={{label: classes.filterControlLabel}}
            />
            <FormControlLabel
              control={<Switch checked={filters.highAged ?? false} onChange={handleFilterChange} name="highAged" />}
              label={<FilterLabel>{'>'} 50 years old <FilterStat nextFilterStateStat={stats?.highAged} /></FilterLabel>}
              classes={{label: classes.filterControlLabel}}
            />
          </FormGroup>
        </FormControl>

        <Divider />

        <FormControl component="fieldset">
          <FormLabel component="legend">By salary</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={<Switch checked={filters.lowSalary ?? false} onChange={handleFilterChange} name="lowSalary" />}
              label={<FilterLabel>{'<'} 40 000$ <FilterStat nextFilterStateStat={stats?.lowSalary} /></FilterLabel>}
              classes={{label: classes.filterControlLabel}}
            />
            <FormControlLabel
              control={<Switch checked={filters.middleSalary ?? false} onChange={handleFilterChange} name="middleSalary" />}
              label={<FilterLabel>Between 40 000$ and 70 000$ <FilterStat nextFilterStateStat={stats?.middleSalary} /></FilterLabel>}
              classes={{label: classes.filterControlLabel}}
            />
            <FormControlLabel
              control={<Switch checked={filters.highSalary ?? false} onChange={handleFilterChange} name="highSalary" />}
              label={<FilterLabel>{'>'} 70 000$ <FilterStat nextFilterStateStat={stats?.highSalary} /></FilterLabel>}
              classes={{label: classes.filterControlLabel}}
            />
          </FormGroup>
        </FormControl>

      </Drawer>
  );
}

type FilterStatProps = {
  nextFilterStateStat?: NextFilterStateStat;
}
const FilterStat = ({
  nextFilterStateStat
}: FilterStatProps) => {
  if (!nextFilterStateStat) {
    return null;
  }

  return (
    nextFilterStateStat.type === 'added' ?
    <Chip variant="default" color="primary" size="small" label={`+ ${nextFilterStateStat.nextDocumentsAdded}`}/> :
    nextFilterStateStat.type === 'narrowed' ?
    <Chip variant="default" color="primary" size="small" label={nextFilterStateStat.nextNumberOfDocuments}/> : 
    <Chip variant="default" color="secondary" size="small" label={nextFilterStateStat.matchingNumberOfDocuments}/>
  )
  
}

type FilterLabelProps = {
  children: ReactNode;
}
const FilterLabel = ({children}: FilterLabelProps) => {
  const classes = useStyles();
  return (
    <Typography 
      variant="button" 
      display="block" 
      gutterBottom
      className={classes.filterLabel}
    >
      {children}
    </Typography>
  );
}