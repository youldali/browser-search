import { Person } from '../models';

export const storeId = 'Persons';
export const simpleFields: (keyof Person)[] = ['name', 'firstName', 'lastName', 'age', 'email', 'salary', 'profession', 'country'];
export const arrayFields: (keyof Person)[] = ['hobbies'];
