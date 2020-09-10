import { filterConfigData, filterDictionary } from './filterConfig.fixture'
import { operatorToFunction } from '../filterConfiguration/operators';
import { 
    FilterFunctionsCollection,
    FilterGroupToFilterFunctions,
    FilterFunctionsToFilterGroup,
    getFilteringData,
} from '../filtering/filtering.model';

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

export const sampleData = [
    { price: 50, numberOfPeople: 1, activity: ['swimming'] },
    { price: 550, numberOfPeople: 2, activity: ['swimming', 'tennis'] },
    { price: 200, numberOfPeople: 1, activity: [] },
];

export const filteringData = getFilteringData(filterConfigData);