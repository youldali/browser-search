import { FilteredBoxStatus } from '../filtering';

export const dataToFilterStatus: Map<any, FilteredBoxStatus> = new Map([
    [{ id: 0, price: 250, numberOfPeople: 1, activity: ['swimming', 'tennis']}, { pass: true }],
    [{ id: 1, price: 1000, numberOfPeople: 2, activity: ['football', 'swimming', 'tennis', 'golfing']}, { pass: true }],
    [{ id: 2, price: 20, numberOfPeople: 5, activity: ['swimming', 'tennis'] }, { pass: false, filterGroupRejected: '0' }],
    [{ id: 3, price: 1000, numberOfPeople: 1, activity: ['football', 'golfing']}, { pass: false, filterGroupRejected: '3' }],
    [{ id: 4, price: 10, numberOfPeople: 2, activity: ['football']}, { pass: false }],
]);