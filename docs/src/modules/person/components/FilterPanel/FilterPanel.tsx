import React from 'react';
import { FiltersApplied } from 'browser-search';
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { PersonQueryResponse } from '../../hooks';

import { FilterListItem } from './FilterListItem';
import { AutocompleteSection } from './AutocompleteSection';

const filterGroupKey = 'base';

type Props = {
  response: PersonQueryResponse;
  filtersAppliedAsRecord: Record<string, boolean>;
  filtersApplied: FiltersApplied;
  isStale?: boolean;
  onResetFilters(): void;
  onSwitchFilter(payload: {key: string, filter: string}): void;
}

export const FilterPanel = ({
  filtersAppliedAsRecord,
  filtersApplied,
  response,
  isStale = false,
  onResetFilters,
  onSwitchFilter,
}: Props) => {
  const {stats} = response;
  const handleFilterChange = (filterName: string) => {
    onSwitchFilter({key: filterGroupKey, filter: filterName});
  };

  return (
    <aside>
      <div>
        <Fab 
          size="medium"
          variant='extended'
          color="secondary"
          onClick={onResetFilters}
          disabled={filtersApplied.length === 0}
        >
          <DeleteOutlineIcon sx={{ mr: 1 }} />
          {filtersApplied.length ? `Reset all (${filtersApplied.length})` : `Reset all`}
        </Fab>
      </div>

      <List sx={{ bgcolor: 'background.paper' }}>
        <ListSubheader disableSticky>By Age</ListSubheader>
        <FilterListItem
          filterName='lowAged'
          label='< 30 years old'
          isChecked={filtersAppliedAsRecord.lowAged ?? false}
          onFilterChange={handleFilterChange}
          nextFilterStateStat={stats?.lowAged}
          isStale={isStale}
        />

        <FilterListItem
          filterName='middleAged'
          label='Between 30 and 50 years old'
          isChecked={filtersAppliedAsRecord.middleAged ?? false}
          onFilterChange={handleFilterChange}
          nextFilterStateStat={stats?.middleAged}
          isStale={isStale}
        />

        <FilterListItem
          filterName='highAged'
          label='> 50 years old'
          isChecked={filtersAppliedAsRecord.highAged ?? false}
          onFilterChange={handleFilterChange}
          nextFilterStateStat={stats?.highAged}
          isStale={isStale}
        />

        <ListSubheader disableSticky>By salary</ListSubheader>
        <FilterListItem
          filterName='lowSalary'
          label='< 40 000$'
          isChecked={filtersAppliedAsRecord.lowSalary ?? false}
          onFilterChange={handleFilterChange}
          nextFilterStateStat={stats.lowSalary}
          isStale={isStale}
        />

        <FilterListItem
          filterName='middleSalary'
          label='Between 40 000$ and 70 000$'
          isChecked={filtersAppliedAsRecord.middleSalary ?? false}
          onFilterChange={handleFilterChange}
          nextFilterStateStat={stats.middleSalary}
          isStale={isStale}
        />

        <FilterListItem
          filterName='highSalary'
          label='> 70 000$'
          isChecked={filtersAppliedAsRecord.highSalary ?? false}
          onFilterChange={handleFilterChange}
          nextFilterStateStat={stats.highSalary}
          isStale={isStale}
        />

        <AutocompleteSection 
          response={response} isStale={isStale}
        />
      </List>
    </aside>
  );
}

