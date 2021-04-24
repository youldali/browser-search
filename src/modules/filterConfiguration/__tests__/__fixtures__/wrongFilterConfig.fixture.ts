import { Operators } from 'modules/filterConfiguration/operators';

export const emptyFilterConfigFixture: any = [
];

export const emptyGroupOfFiltersFixture: any = [
    [ 
        { id: 'priceMin', field: 'price', operator: Operators.gt, operand: 200 }, 
    ],
    [ 
    ]
];

export const incompleteFilterFixture: any = [
    [ 
        { field: 'price', operator: Operators.gt, operand: 200 }, 
        { id: 'priceMax', field: 'price', operator: Operators.lt, operand: 500 }, 
    ],
];

export const invalidOperatorFixture: any = [
    [ 
        { field: 'price', operator: '.....', operand: 200 }, 
    ],
];