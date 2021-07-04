import { FilterConfig } from 'browser-search';
import { Person } from '../modules'

export const storeId = 'Persons';

export const filterConfig: FilterConfig<Person> = [ 
  [ 
    { id: 'lowAged', field: 'age', operator: 'lt', operand: 30 }, // Filter
    { id: 'middleAged', field: 'age', operator: 'inRangeClosed', operand: [30, 50] }, // Filter
    { id: 'highAged', field: 'age', operator: 'gt', operand: 50 }, // Filter
  ],
  [
    { id: 'professionDentist', field: 'profession', operator: 'equals', operand: 'Dentist'}
  ]
];