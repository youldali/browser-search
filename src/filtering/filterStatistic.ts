//@flow
import type { BoxId, BoxesIdMappedByFilteredStatus, FilterGroup, FilterStatisticDetailed } from '../types';

import { findIntersectionOfSortedArrays } from 'helpers/array/utils.js'
import { curry } from 'ramda';

const _getFilterStatistic = 
(   boxesIdMappedByFilteredStatus: BoxesIdMappedByFilteredStatus, 
    boxesIdMatchingFilter: BoxId[], 
    isFilterSelected: boolean, 
    filterGroup: FilterGroup
): FilterStatisticDetailed => {
    
    const findBoxesIdsMatchingFilter = findIntersectionOfSortedArrays(boxesIdMatchingFilter);

    //useful for filter belonging to a filter group, exp: +3
    const getBoxesIdListAddedByFilter = () => (
        {
            type: 'relative',
            idList: findBoxesIdsMatchingFilter(boxesIdMappedByFilteredStatus.get(filterGroup))
        }
    );

    //for independant filter
    const getBoxesIdLimitedByFilter= () => (
        {
            type: 'absolute',
            idList: findBoxesIdsMatchingFilter(boxesIdMappedByFilteredStatus.get(true))
        }
    );

    return (
        isFilterSelected || boxesIdMappedByFilteredStatus.get(filterGroup) === undefined
        ? getBoxesIdLimitedByFilter()
        : getBoxesIdListAddedByFilter()
    );
};

const getFilterStatistic = curry(_getFilterStatistic);

export default getFilterStatistic;