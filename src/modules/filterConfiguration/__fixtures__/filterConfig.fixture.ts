import { 
    buildFilterConfigData, 
    Filter, 
    FilterConfig,
    FiltersByGroup,
    FilterToGroup,
} from '../filterConfig.model';

import { 
    FilterFunctionsCollection,
    FilterGroupToFilterFunctions,
    FilterFunctionsToFilterGroup,
} from '../../filtering/filter.model';

import { Operators, operatorToFunction } from '../operators';

export const filterDictionary: Dictionary<Filter> = {
    priceMin: { id: 'priceMin', field: 'price', operator: Operators.gt, operand: 200 },
    priceMax: { id: 'priceMax', field: 'price', operator: Operators.lt, operand: 500 },
    numberOfPeople: { id: 'numberOfPeople', field: 'numberOfPeople', operator: Operators.equals, operand: 2 },
    "activity-1": { id: 'activity-1', field: 'activity', operator: Operators.contains, operand: 'swimming' },
    "activity-2": { id: 'activity-2', field: 'activity', operator: Operators.contains, operand: 'tennis' },
    "activity-3": { id: 'activity-3', field: 'activity', operator: Operators.contains, operand: 'golfing' },
};

export const filterByGroup: FiltersByGroup = {
    '0': [filterDictionary.priceMin, filterDictionary.priceMax],
    '1': [filterDictionary.numberOfPeople],
    '2': [filterDictionary['activity-1'], filterDictionary['activity-2'], filterDictionary['activity-3']],
}

export const filterToGroup: FilterToGroup = new Map([
    [filterDictionary.priceMin, '0'],
    [filterDictionary.priceMax, '0'],
    [filterDictionary.numberOfPeople, '1'],
    [filterDictionary['activity-1'], '2'],
    [filterDictionary['activity-2'], '2'],
    [filterDictionary['activity-3'], '2'],
]);

export const filterConfig: FilterConfig = [
    [filterDictionary.priceMin, filterDictionary.priceMax],
    [filterDictionary.numberOfPeople],
    [filterDictionary['activity-1'], filterDictionary['activity-2'], filterDictionary['activity-3']]
];

export const filtersApplied = [filterDictionary.priceMin, filterDictionary['activity-1'], filterDictionary['activity-2']];

export const filtersIdsApplied = ['priceMin', 'activity-1', 'activity-2'];

export const filterConfigData = buildFilterConfigData(filterConfig)(filtersIdsApplied);

export const priceMinFilterFunction = (target: any) => 
    operatorToFunction[filterDictionary.priceMin.operator](target?.[filterDictionary.priceMin.field], filterDictionary.priceMin.operand);

export const activity1FilterFunction = (target: any) => 
    operatorToFunction[filterDictionary['activity-1'].operator](target?.[filterDictionary['activity-1'].field], filterDictionary['activity-1'].operand);

export const activity2FilterFunction = (target: any) => 
    operatorToFunction[filterDictionary['activity-2'].operator](target?.[filterDictionary['activity-2'].field], filterDictionary['activity-2'].operand);

export const filterFunctionsCollection: FilterFunctionsCollection = [
    [priceMinFilterFunction],
    [activity1FilterFunction, activity2FilterFunction]
];

export const filterGroupToFilterFunctions: FilterGroupToFilterFunctions = {
    '0': filterFunctionsCollection[0],
    '2': filterFunctionsCollection[1],
}

export const filterFunctionsToFilterGroup: FilterFunctionsToFilterGroup = new Map([
    [filterGroupToFilterFunctions['0'], '0'],
    [filterGroupToFilterFunctions['2'], '2'],
]);

export const sampleData = [
    { price: 50, numberOfPeople: 1, activity: ['swimming'] },
    { price: 550, numberOfPeople: 2, activity: ['swimming', 'tennis'] },
    { price: 200, numberOfPeople: 1, activity: [] },
]