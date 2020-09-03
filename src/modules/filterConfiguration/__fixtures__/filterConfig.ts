import { FilterConfig } from '../filterConfig.model';
import { Operators } from '../operators'

export const validFilterConfig: FilterConfig = [
    [ 
        { id: 'priceMin', field: 'price', operator: Operators.gt, operand: 200 }, 
        { id: 'priceMax', field: 'price', operator: Operators.lt, operand: 500 }, 
    ],
    [ 
        { id: 'numberOfPeople', field: 'numberOfPeople', operator: Operators.equals, operand: 2 }, 
    ],
    [ 
        { id: 'activity-1', field: 'activity', operator: Operators.contains, operand: 'swimming' }, 
        { id: 'activity-2', field: 'activity', operator: Operators.contains, operand: 'tennis' }, 
        { id: 'activity-3', field: 'activity', operator: Operators.contains, operand: 'golfing' }, 
    ]
];

export const emptyFilterConfig: any = [
];

export const emptyGroupOfFilters: any = [
    [ 
        { id: 'priceMin', field: 'price', operator: Operators.gt, operand: 200 }, 
    ],
    [ 
    ]
];

export const incompleteFilter: any = [
    [ 
        { field: 'price', operator: Operators.gt, operand: 200 }, 
        { id: 'priceMax', field: 'price', operator: Operators.lt, operand: 500 }, 
    ],
];

export const invalidOperator: any = [
    [ 
        { field: 'price', operator: '.....', operand: 200 }, 
    ],
];