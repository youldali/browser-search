import { FilterConfig } from '@browser-search/browser-search';

import { Person } from '../models';

export type FilterId = 'lowAged' | 'middleAged' | 'highAged' | 'lowSalary' | 'middleSalary' | 'highSalary' | 'professionDentist' | string;

export const filterConfig: FilterConfig<Person, FilterId> = [ 
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
