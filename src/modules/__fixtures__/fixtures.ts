import { 
    buildFilterConfigData, 
    Filter, 
    FilterConfig,
    FiltersByGroup,
} from '../filterConfiguration/filterConfig.model';
import { Operators, operatorToFunction } from '../filterConfiguration/operators';
import { 
    FilterFunctionsCollection,
    FilterGroupToFilterFunctions,
    FilterFunctionsToFilterGroup,
    FilteredItemStatus,
    getFilteringFunctionsData,
    getFilterStatusForItem,
} from '../filteringStatus';
import { createFilteringData, FilterIdToMatchingItemIds } from '../filteringData';


export const items: any[] = [
    { id: 0, price: 250, numberOfPeople: 1, activity: ['swimming', 'tennis']},
    { id: 1, price: 1000, numberOfPeople: 2, activity: ['football', 'swimming', 'tennis', 'golfing']},
    { id: 2, price: 20, numberOfPeople: 5, activity: ['swimming', 'tennis'] },
    { id: 3, price: 1000, numberOfPeople: 1, activity: ['football', 'golfing']},
    { id: 4, price: 10, numberOfPeople: 2, activity: ['football']},
];

/**
 * FilterConfiguration Module
 */
export const filterDictionary: Dictionary<Filter> = {
    priceMin: { id: 'priceMin', field: 'price', operator: Operators.gt, operand: 200 },
    priceMax: { id: 'priceMax', field: 'price', operator: Operators.lt, operand: 500 },
    numberOfPeople: { id: 'numberOfPeople', field: 'numberOfPeople', operator: Operators.equals, operand: 2 },
    "activity-1": { id: 'activity-1', field: 'activity', operator: Operators.contains, operand: 'swimming' },
    "activity-2": { id: 'activity-2', field: 'activity', operator: Operators.contains, operand: 'tennis' },
    "activity-3": { id: 'activity-3', field: 'activity', operator: Operators.contains, operand: 'golfing' },
};

export const filterByGroup: FiltersByGroup = {
    '0': [filterDictionary.priceMin],
    '1': [filterDictionary.priceMax],
    '2': [filterDictionary.numberOfPeople],
    '3': [filterDictionary['activity-1'], filterDictionary['activity-2'], filterDictionary['activity-3']],
}

export const filterConfig: FilterConfig = [
    [filterDictionary.priceMin],
    [filterDictionary.priceMax],
    [filterDictionary.numberOfPeople],
    [filterDictionary['activity-1'], filterDictionary['activity-2'], filterDictionary['activity-3']]
];

export const filtersIdsApplied = ['priceMin', 'activity-1', 'activity-2'];
export const filterConfigData = buildFilterConfigData(filterConfig)(filtersIdsApplied);

/**
 * Filtering Module
 */

const priceMinFilterFunction = (target: any) => 
    operatorToFunction[filterDictionary.priceMin.operator](target?.[filterDictionary.priceMin.field], filterDictionary.priceMin.operand);

const activity1FilterFunction = (target: any) => 
    operatorToFunction[filterDictionary['activity-1'].operator](target?.[filterDictionary['activity-1'].field], filterDictionary['activity-1'].operand);

const activity2FilterFunction = (target: any) => 
    operatorToFunction[filterDictionary['activity-2'].operator](target?.[filterDictionary['activity-2'].field], filterDictionary['activity-2'].operand);

export const filterFunctionsCollection: FilterFunctionsCollection = [
    [priceMinFilterFunction],
    [activity1FilterFunction, activity2FilterFunction]
];

export const filterGroupToFilterFunctions: FilterGroupToFilterFunctions = {
    '0': filterFunctionsCollection[0],
    '3': filterFunctionsCollection[1],
}

export const filterFunctionsToFilterGroup: FilterFunctionsToFilterGroup = new Map([
    [filterGroupToFilterFunctions['0'], '0'],
    [filterGroupToFilterFunctions['3'], '3'],
]);

export const filteringData = getFilteringFunctionsData(filterConfigData);

export const itemToFilteringStatus:  Map<any, FilteredItemStatus> = new Map (
    items.map( item => [
        item,
        getFilterStatusForItem(filteringData)(item),
    ])
);


/**
 * FilterStatistics Module
 */

export const filterIdToMatchingItemIds: FilterIdToMatchingItemIds = {
    [filterDictionary.priceMin.id]: [0, 1, 3],
    [filterDictionary.priceMax.id]: [0, 2, 4],
    [filterDictionary.numberOfPeople.id]: [1, 4],
    [filterDictionary['activity-1'].id]: [0, 1, 2],
    [filterDictionary['activity-2'].id]: [0, 1, 2],
    [filterDictionary['activity-3'].id]: [1, 3],
}

const filteringStatisticsDataBuilder = createFilteringData(filterConfigData)(filterIdToMatchingItemIds);
itemToFilteringStatus.forEach( (filteredItemStatus, item) => {
        filteringStatisticsDataBuilder.addFilteredObjectStatus(filteredItemStatus, item.id)
    }
);
export const filteringStatisticsData = filteringStatisticsDataBuilder.done();