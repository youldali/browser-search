import { getFilterStatusForItem, FilteredBoxStatus } from '../filtering';
import { filteringData } from './filtering.fixture';

export const items: any[] = [
    { id: 0, price: 250, numberOfPeople: 1, activity: ['swimming', 'tennis']},
    { id: 1, price: 1000, numberOfPeople: 2, activity: ['football', 'swimming', 'tennis', 'golfing']},
    { id: 2, price: 20, numberOfPeople: 5, activity: ['swimming', 'tennis'] },
    { id: 3, price: 1000, numberOfPeople: 1, activity: ['football', 'golfing']},
    { id: 4, price: 10, numberOfPeople: 2, activity: ['football']},
];

export const itemToFilteringStatus:  Map<any, FilteredBoxStatus> = new Map (
    items.map( item => [
        item,
        getFilterStatusForItem(filteringData)(item),
    ])
);
