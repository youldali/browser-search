import { Operators } from 'modules/filterConfiguration/operators';

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