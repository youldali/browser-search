import { FilteredBoxStatus } from '../filtering/filteringStatus';

export const dataToFilterStatus: Map<any, FilteredBoxStatus> = new Map([
    [{ price: 250, numberOfPeople: 1, activity: ['swimming', 'tennis']}, { pass: true }],
    [{ price: 1000, numberOfPeople: 1, activity: ['football', 'swimming', 'tennis', 'golfing']}, { pass: true }],
    [{ price: 20, numberOfPeople: 1, activity: ['swimming', 'tennis'] }, { pass: false, filterGroupRejected: '0' }],
    [{ price: 1000, numberOfPeople: 1, activity: ['football', 'golfing']}, { pass: false, filterGroupRejected: '3' }],
    [{ price: 10, numberOfPeople: 1, activity: ['football']}, { pass: false }],
]);