//@flow
import type { BoxId, Box, BoxesIdMappedByFilteredStatus, FilterStructureMap } from '../types';
import type { BoxCollectionRequestData } from 'modules/actions/types';

import getFilterFunctionsData from '../filteringHelpers/filterFunctionBuilder';
import getFilterStatusForItem from '../filteringHelpers/filterStatus';
import createBoxesFilteredStatusStructure from '../filteringHelpers/filteredBoxesStatusStructure';
import { getAllBoxesId, iterateOverBoxes } from '../services/idbStorageService';
import { curry } from 'ramda';

const _getBoxesIdMappedByFilterStatus = (requestData: BoxCollectionRequestData, filterStructureMap: FilterStructureMap): Promise<BoxesIdMappedByFilteredStatus> => {
    const {universe, filtersApplied} = requestData;
    
    const withFiltersApplied = async () => {  
        //filter function builder
        const {filterFunctionListByGroup, filterFunctionListMappedToFilterGroup, filterGroupList} = getFilterFunctionsData(filterStructureMap, filtersApplied);
    
        //filtering
        const 
            appliedGetFilterStatusForItem = getFilterStatusForItem(filterFunctionListByGroup, filterFunctionListMappedToFilterGroup),
            filterStatisticStructure = createBoxesFilteredStatusStructure(filterGroupList),
            appliedIterateOnItemCallback = iterateOnItemCallback(filterStatisticStructure, appliedGetFilterStatusForItem);
    
        await iterateOverBoxes(universe, appliedIterateOnItemCallback);
    
        return filterStatisticStructure.getBoxesIdMappedByFilteredStatus();
    };


    const whenNoFilterApplied = async () => {
        const boxIdList = await getAllBoxesId(universe, false);
    
        const filterStatisticStructure = createBoxesFilteredStatusStructure();
        filterStatisticStructure.setStatusValue({pass: true}, boxIdList);
        return filterStatisticStructure.getBoxesIdMappedByFilteredStatus();
    };


    return Object.keys(filtersApplied).length === 0 ? whenNoFilterApplied() : withFiltersApplied();
};
const getBoxesIdMappedByFilterStatus = curry(_getBoxesIdMappedByFilterStatus);


const _iterateOnItemCallback = (filterStatisticStructure: Object, getFilterStatusForItem: Function, itemId: BoxId, item: Box): void =>  {
    const status = getFilterStatusForItem(item);
    filterStatisticStructure.addFilteredObjectStatus(status, itemId);
};
const iterateOnItemCallback = curry(_iterateOnItemCallback);


export default getBoxesIdMappedByFilterStatus;











