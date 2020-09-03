import { FilterConfig } from '../filter.model';
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

export const invalidFilterConfig1: any = [
];

export const invalidFilterConfig2: any = [
    [ 
        { id: 'priceMin', field: 'price', operator: Operators.gt, operand: 200 }, 
    ],
    [ 
    ]
];

export const invalidFilterConfig3: any = [
    [ 
        { field: 'price', operator: Operators.gt, operand: 200 }, 
        { id: 'priceMax', field: 'price', operator: Operators.lt, operand: 500 }, 
    ],
];