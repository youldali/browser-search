import { 
    Filter, 
    FilterConfig,
} from '../../filterConfig.model';
import { createFixture, createArrayFixture } from 'helpers/fixture.util';

type ItemActivity = 'swimming' | 'tennis' | 'football' | 'golfing';
interface Item {
  id: number;
  price: number;
  numberOfPeople: number;
  activity: ItemActivity[];
}

type FilterIds = 'priceMin' | 'priceMax' | 'numberOfPeople' | 'activity-1' | 'activity-2' | 'activity-3';

const filterDictionaryFixture: Record<FilterIds, Filter<Item, FilterIds>> = {
    priceMin: { id: 'priceMin', field: 'price', operator: 'gt', operand: 200 },
    priceMax: { id: 'priceMax', field: 'price', operator: 'lt', operand: 500 },
    numberOfPeople: { id: 'numberOfPeople', field: 'numberOfPeople', operator: 'equals', operand: 2 },
    "activity-1": { id: 'activity-1', field: 'activity', operator: 'contains', operand: 'swimming' },
    "activity-2": { id: 'activity-2', field: 'activity', operator: 'contains', operand: 'tennis' },
    "activity-3": { id: 'activity-3', field: 'activity', operator: 'contains', operand: 'golfing' },
};
export const getFilterDictionaryFixture = createFixture(filterDictionaryFixture);

const filterConfigFixture: FilterConfig<Item, FilterIds> = [
    [filterDictionaryFixture.priceMin],
    [filterDictionaryFixture.priceMax],
    [filterDictionaryFixture.numberOfPeople],
    [filterDictionaryFixture['activity-1'], filterDictionaryFixture['activity-2'], filterDictionaryFixture['activity-3']]
];
export const getFilterConfigFixture = createArrayFixture(filterConfigFixture);

export const getFiltersIdsAppliedFixture = createArrayFixture<FilterIds>(['priceMin', 'activity-1', 'activity-2']);
