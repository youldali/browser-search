import { 
    buildFilterConfigData, 
    Filter, 
    FilterConfig,
} from '../../filterConfig.model';
import { Operators } from '../../operators';

type ItemActivity = 'swimming' | 'tennis' | 'football' | 'golfing';
interface Item {
  id: number;
  price: number;
  numberOfPeople: number;
  activity: ItemActivity[];
}

export const filterDictionary: Dictionary<Filter<Item>> = {
    priceMin: { id: 'priceMin', field: 'price', operator: Operators.gt, operand: 200 },
    priceMax: { id: 'priceMax', field: 'price', operator: Operators.lt, operand: 500 },
    numberOfPeople: { id: 'numberOfPeople', field: 'numberOfPeople', operator: Operators.equals, operand: 2 },
    "activity-1": { id: 'activity-1', field: 'activity', operator: Operators.contains, operand: 'swimming' },
    "activity-2": { id: 'activity-2', field: 'activity', operator: Operators.contains, operand: 'tennis' },
    "activity-3": { id: 'activity-3', field: 'activity', operator: Operators.contains, operand: 'golfing' },
};

export const filterConfig: FilterConfig<Item> = [
    [filterDictionary.priceMin],
    [filterDictionary.priceMax],
    [filterDictionary.numberOfPeople],
    [filterDictionary['activity-1'], filterDictionary['activity-2'], filterDictionary['activity-3']]
];

export const filtersIdsApplied = ['priceMin', 'activity-1', 'activity-2'];
export const filterConfigData = buildFilterConfigData(filterConfig)(filtersIdsApplied);
