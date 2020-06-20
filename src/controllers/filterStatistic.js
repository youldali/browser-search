//@flow

import type {BoxesIdMappedByFilteredStatus, FilterStatisticDetailed, FiltersStatisticsDetailed, FilterStatisticSimplified, FilterStructure, FilterStructureMap } from '../types';
import type { BoxCollectionRequestData } from 'modules/actions/types';

import { getItemIdListMatchingSingleFilter } from '../services/idbStorageService';
import helperGetFilterStatistic  from '../filteringHelpers/filterStatistic';
import { has, map, mergeAll, curry } from 'ramda';

const _getFiltersStatistics = (requestData: BoxCollectionRequestData, filterStructureMap: FilterStructureMap, boxesIdMappedByFilteredStatus: BoxesIdMappedByFilteredStatus): Promise<FiltersStatisticsDetailed> => {
    const { filtersApplied, universe } = requestData;

    const getFilterStatistic = async (filterStructure: FilterStructure) => {
        const 
            {filterName, filterGroup} = filterStructure,
            isFilterSelected = has(filterName, filtersApplied) ? true : false,
            boxesIdMatchingFilter = await getItemIdListMatchingSingleFilter(universe, filterStructure);
            return {
                [filterName]: helperGetFilterStatistic(boxesIdMappedByFilteredStatus, boxesIdMatchingFilter, isFilterSelected, filterGroup)
            };
    };

    const filterStatisticsPromise = map(getFilterStatistic, Object.values(filterStructureMap));
    return Promise.all(filterStatisticsPromise)
            .then(filterStatisticList => mergeAll(filterStatisticList));
}

const getFiltersStatistics = curry(_getFiltersStatistics);

export default getFiltersStatistics;


export
const getFiltersStatisticsSimplified = (filtersStatisticsDetailed: FiltersStatisticsDetailed): FilterStatisticSimplified => {
    const simplifyFilterStatistic = (filterStatisticDetailed: FilterStatisticDetailed) => ({
        type: filterStatisticDetailed.type,
        number: filterStatisticDetailed.idList.length
    });

    return map(simplifyFilterStatistic, filtersStatisticsDetailed);
}


