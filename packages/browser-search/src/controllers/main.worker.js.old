//@flow
/* global location */
/* eslint no-restricted-globals: ["off", "self"] */

import type { Box, BoxId, BoxesIdMappedByFilteredStatus, FilterStatisticDetailed, FilterStatisticSimplified } from '../types';
import type { BoxCollectionRequestData } from 'modules/actions/types';

import 'polyfills';
import filterConfig from '../config/filter.config';
import getFilterStructureMap from '../configHelpers/filterConfigResolver'
import getBoxesIdMappedByFilterStatus from './filter';
import getOrderedBoxIdList from './order';
import getPaginatedBoxList from './pagination';
import getFiltersStatistics, { getFiltersStatisticsSimplified } from './filterStatistic';
import { getNumberOfBoxes } from '../services/idbStorageService';
import { composeP, equals, pick } from 'ramda';


type BoxListComputation = {
    boxesIdMappedByFilteredStatus: ?BoxesIdMappedByFilteredStatus,
    orderedBoxIdList: ?BoxId[],
    paginatedBoxList: ?Box[],
};

type FiltersStatisticsComputation = {
    filtersStatisticsDetailedByFilter: ?FilterStatisticDetailed,
    filtersStatisticsByFilter: ?FilterStatisticSimplified,
    numberOfMatchingBoxes: number,
    totalNumberOfBoxes: number,
};

const perPage = 10;

self.onmessage = async (event) => {
    const requestData: BoxCollectionRequestData = event.data;
    processBoxRequest(requestData);
};


const processBoxRequest = (function (){
    const 
        FILTERING_CHANGE = 1,
        ORDERING_CHANGE = 2,
        PAGINATION_CHANGE = 3;

    let 
        ongoingRequest = null,
        lastRequestData = {
            universe: null,
            filtersApplied: null,
            orderBy: null,
            page: null,
        },
        lastBoxListComputation: BoxListComputation = {
            boxesIdMappedByFilteredStatus: null,
            orderedBoxIdList: null,
            paginatedBoxList: null,
        },
        lastFilterStatisticComputation: FiltersStatisticsComputation = {
            filtersStatisticsDetailedByFilter: null,
            filtersStatisticsByFilter: null,
            numberOfMatchingBoxes: 0,
            totalNumberOfBoxes: 0,
        };

    return async (requestData: BoxCollectionRequestData) => {

        ongoingRequest = requestData;

        const 
            isRequestStillValid = () => ongoingRequest === requestData,
            dropIfRequestIsInvalid = (f: Function) => (...args: any) => {
                return isRequestStillValid() ? Promise.resolve(f(...args)) : Promise.resolve(null)
            };

        const 
            {universe, filtersApplied, orderBy, page} = requestData,
            filterConfigForUniverse = filterConfig[universe],
            filterStructureMap = await getFilterStructureMap(universe, filterConfigForUniverse);

        const levelChange = 
            universe !== lastRequestData.universe || !equals(filtersApplied, lastRequestData.filtersApplied) ? FILTERING_CHANGE :
            orderBy !== lastRequestData.orderBy ? ORDERING_CHANGE :
            page !== lastRequestData.page ? PAGINATION_CHANGE :
            null;

        
        const doBoxListComputation = (previousBoxListComputation: BoxListComputation): Promise<?BoxListComputation> => {
            const newBoxListComputation = Object.assign({}, previousBoxListComputation);
            
            const 
                onFilterChanged = dropIfRequestIsInvalid( async (filterStructureMap, newBoxListComputation: BoxListComputation) => {
                    const boxesIdMappedByFilteredStatus = await getBoxesIdMappedByFilterStatus(requestData, filterStructureMap);
        
                    newBoxListComputation.boxesIdMappedByFilteredStatus = boxesIdMappedByFilteredStatus;
                    return newBoxListComputation;
                }),
                onOrderingChanged = dropIfRequestIsInvalid( async (newBoxListComputation: BoxListComputation) => {
                    const
                        {boxesIdMappedByFilteredStatus} = newBoxListComputation,
                        orderedBoxIdList = await getOrderedBoxIdList(requestData, boxesIdMappedByFilteredStatus.get(true));
        
                    newBoxListComputation.orderedBoxIdList = orderedBoxIdList;
                    return newBoxListComputation;
                }),
                onPaginationChanged = dropIfRequestIsInvalid(async (newBoxListComputation: BoxListComputation) => {
                    const 
                        {orderedBoxIdList} = newBoxListComputation,
                        paginatedBoxList = await getPaginatedBoxList(requestData, perPage, orderedBoxIdList);
        
                    newBoxListComputation.paginatedBoxList = paginatedBoxList;
                    return newBoxListComputation;
                });
        
            return (
                levelChange === FILTERING_CHANGE ? composeP(onPaginationChanged, onOrderingChanged, onFilterChanged)(filterStructureMap, newBoxListComputation) : 
                levelChange === ORDERING_CHANGE ? composeP(onPaginationChanged, onOrderingChanged)(newBoxListComputation) :
                levelChange === PAGINATION_CHANGE ? onPaginationChanged(newBoxListComputation) :
                Promise.resolve(previousBoxListComputation)
            );
        };

        const doFiltersStatisticsComputation = (previousFiltersStatisticsComputation: FiltersStatisticsComputation, boxListComputation: ?BoxListComputation): Promise<?FiltersStatisticsComputation> => {
            if(!boxListComputation)
                return Promise.resolve(null);

            const { boxesIdMappedByFilteredStatus } = boxListComputation;
        
            const onFilteringChanged = dropIfRequestIsInvalid(async () => {    
                const 
                    filtersStatisticsDetailedByFilter = await getFiltersStatistics(requestData, filterStructureMap, boxesIdMappedByFilteredStatus),
                    filtersStatisticsByFilter = getFiltersStatisticsSimplified(filtersStatisticsDetailedByFilter);
        
                const 
                    totalNumberOfBoxes = await getNumberOfBoxes(universe),
                    newFiltersStatisticsComputation = {
                        filtersStatisticsDetailedByFilter,
                        filtersStatisticsByFilter,
                        numberOfMatchingBoxes: boxesIdMappedByFilteredStatus.get(true).length,
                        totalNumberOfBoxes,
                    };
        
                return newFiltersStatisticsComputation;
            });
        
            return levelChange === FILTERING_CHANGE ? onFilteringChanged() : Promise.resolve(previousFiltersStatisticsComputation);
        };


        const tryPostBoxList = (boxListComputation: ?BoxListComputation) => {
            if(!boxListComputation || !levelChange)
                return;

            return postBoxList(boxListComputation.paginatedBoxList);
        };

        const tryPostBoxesStatistics = (filtersStatisticsComputation: ?FiltersStatisticsComputation) => {
            if(!filtersStatisticsComputation || levelChange !== FILTERING_CHANGE)
                return;

            const boxesStatistics = pick(['filtersStatisticsByFilter', 'numberOfMatchingBoxes', 'totalNumberOfBoxes'], filtersStatisticsComputation);
            return postBoxesStatistics(boxesStatistics);
        };

        const saveComputations = (requestData, newBoxListComputation, newFiltersStatisticsComputation) => {
            if(!newBoxListComputation || !newFiltersStatisticsComputation)
                return;

            lastBoxListComputation = newBoxListComputation;
            lastFilterStatisticComputation = newFiltersStatisticsComputation;
            lastRequestData = requestData;
        }
        
        const newBoxListComputation = await doBoxListComputation(lastBoxListComputation);
        tryPostBoxList(newBoxListComputation);

        const newFiltersStatisticsComputation = await doFiltersStatisticsComputation(lastFilterStatisticComputation, newBoxListComputation);
        tryPostBoxesStatistics(newFiltersStatisticsComputation);

        saveComputations(requestData, newBoxListComputation, newFiltersStatisticsComputation);
    }
})();


const postBoxList = (boxList) => {
    self.postMessage({ type: 'BOX_LIST', boxList: boxList });
};

const postBoxesStatistics = (boxesStatistics) => {
    self.postMessage({ type: 'BOXES_STATISTICS', boxesStatistics });
};
