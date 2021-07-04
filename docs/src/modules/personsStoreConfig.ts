import { FilterConfig } from 'browser-search';
import { Person } from '.'

export const storeId = 'Persons';

export const filterConfig: FilterConfig<Person> = [ 
  [ 
    { id: 'lowAged', field: 'age', operator: 'lt', operand: 30 },
    { id: 'middleAged', field: 'age', operator: 'inRangeClosed', operand: [30, 50] },
    { id: 'highAged', field: 'age', operator: 'gt', operand: 50 },
  ],
  [ 
    { id: 'lowSalary', field: 'salary', operator: 'lt', operand: 40000 },
    { id: 'middleSalary', field: 'salary', operator: 'inRangeClosed', operand: [40000, 70000] },
    { id: 'highSalary', field: 'salary', operator: 'gt', operand: 70000 },
  ],
  [
    { id: 'professionDentist', field: 'profession', operator: 'equals', operand: 'Dentist'}
  ]
];