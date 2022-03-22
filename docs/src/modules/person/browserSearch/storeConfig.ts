import { Person } from '../models';

export const storeId = 'Persons';
export const simpleFields: (keyof Person)[] = ['name', 'age', 'email', 'salary', 'profession', 'country'];
export const arrayFields: (keyof Person)[] = ['favoriteColours'];
